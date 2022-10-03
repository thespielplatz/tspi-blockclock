require('dotenv').config();
const lnurl = require('lnurl');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const crypto = require('crypto');

const APP_NAME = 'LNURL Server'
const EXPRESS_PORT = process.env.EXPRESS_PORT || 4003;

const LNURL_PORT = process.env.LNURL_PORT || 4002;
const LNURL_URL = process.env.LNURL_URL || 'https://lnurl.sate.tools';
const backend = 'lnbits';
const config = {
	baseUrl: 'https://legend.lnbits.com',
	adminKey: process.env.LNBITS_API_KEY,
};

const addInvoice = async (ln) => {
  try {
    const result = await ln.addInvoice(21000, { description: 'testing lightning-backends' });
    console.log('addInvoice OK', { result });
  } catch (error) {
    console.error('addInvoice FAILED:', { error });
  }
};

const generateNewPayRequest = async (server) => {
  const tag = 'payRequest';
  const params = {
    minSendable: 10000,
    maxSendable: 200000,
    metadata: '[["text/plain", "lnurl-node"]]',
    commentAllowed: 500,
  };
  const result = await server.generateNewUrl(tag, params);
	console.log('generateNewPayRequest', result);
};

// hash: kay
const loggedIn = {};
const lnurlServer = lnurl.createServer({
  host: 'localhost',
  port: LNURL_PORT,
  url: LNURL_URL,
  lightning: {
    backend,
    config,
  },
});
lnurlServer.on('login', (event) => {
  // `key` - the public key as provided by the LNURL wallet app
  // `hash` - the hash of the secret for the LNURL used to login
  const { key, hash } = event;
  loggedIn[hash] = key;
});

const app = express();
app.use(cors());
app.use(helmet());
app.get('/api/lnurl/create', async (req, res) => {
  const result = await lnurlServer.generateNewUrl('login');
  const secret = Buffer.from(result.secret, 'hex');
  const hash = crypto.createHash('sha256').update(secret).digest('hex');
  loggedIn[hash] = false;
  res.json({
    status: 'success',
    data: { ...result, hash },
  });
});
app.get('/api/lnurl/status/:hash', async (req, res) => {
  const hash = req.params.hash;
  if (loggedIn[hash] == null) {
    res.status(404).json({
      status: 'error',
      data: 'not found',
    });
    return;
  }
  if (typeof loggedIn[hash] === 'string') {
    res.json({
      status: 'success',
      data: loggedIn[hash],
    });
    return;
  }
  res.status(403).json({
    status: 'error',
    data: 'not logged in',
  });
});

const server = app.listen(4003, () => {
  console.info(`${APP_NAME} running on ${EXPRESS_PORT}`);
});

let connections = [];

server.on('connection', (connection) => {
  connections.push(connection);
  connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

const shutDown = () => {
  // Closing Server
  server.close(() => {
    console.info('Closed out remaining connections');
    process.exit(0);
  });

  // Closing all opened connection
  connections.forEach(curr => curr.end());
  setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);

  // Timeout for forceclosing the connections
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => {
  console.info(`SIGTERM signal received: Shutting down ${APP_NAME} ...`);
  shutDown(server, connections);
});

process.on('SIGINT', () => {
  console.info(`SIGINT signal received: Shutting down ${APP_NAME} ...`);
  shutDown(server, connections);
});
