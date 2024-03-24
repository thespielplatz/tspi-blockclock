const fs = require('fs')

const getLogger = ({ logToFile = false }) => {
  if (logToFile) {
    return new FileLogger()
  }
  return console
}

class FileLogger {
  log(...args) {
    this.writeToFile('log', args)
  }

  info(...args) {
    this.writeToFile('info', args)
  }

  warn(...args) {
    this.writeToFile('warn', args)
  }

  error(...args) {
    this.writeToFile('error', args)
  }

  writeToFile(type, args) {
    args = this.prependTimeAndType(type, args)
    const message = `${this.stringifyArgs(args)}\n`
    if (!fs.existsSync('logs'))  {
      fs.mkdirSync('logs')
    }
    fs.appendFileSync('logs/logger.txt', message)
    fs.appendFileSync(`logs/${type}.txt`, message)
  }

  prependTimeAndType(type, args) {
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60000
    const time = (new Date(Date.now() - timezoneOffset)).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    const prepend = `[${time} - ${type.toUpperCase()}]`

    if (typeof args[0] === 'string') {
      return [`${prepend} ${args[0]}`, ...args.slice(1)]
    }
  
    return [prepend, ...args]
  }

  stringifyArgs(args) {
    return args
      .map((value) => {
        if (typeof value === 'string') {
          return value
        }
        try {
          return util.inspect(value)
        } catch (error) {
          return 'stringifyArgs: Unable to util.inspect value, check error logs'
        }
      })
      .join('\n')
  }
}

module.exports = getLogger
