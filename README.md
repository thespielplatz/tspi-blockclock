# Blockclock 🧊⏰
Private homebrew project for a blockclock

### Hardware

- Raspberry PI Zero W
- Neopixel (ws281x)

### Power Calculations

POWER of a pixel == 0,06A (per LED 0,02A)

Count 250 Pixel == 15A

Power Source: 10A

Rapsi Power Consumption ~ 0,4A

**DO NOT RUN ALL ON FULL POWER**

`ws281x.setBrightness(100) // below 60%`

# Setup

- clone
- create .env from .env.example
- npm i

### Problem: Hardware revision is not supported 

- Follow [this](https://github.com/beyondscreen/node-rpi-ws281x-native/issues/130#issuecomment-1253729355)

### Autostart

``` bash
# Install pm2 globally
sudo npm install pm2@latest -g

# Set it at startup
pm2 startup
## Follow the on screen instructions

# start app with ecosystem
pm2 start ecosystem.config.js

# save pm2 list for startup
pm2 save
```

### Apps

```
# Text anzeigen
sudo node app_text.js "hi hi hi"

# Pixel Testen
sudo node app_pixel.js 50 65280

# Blockclock
sudo node app_blockclock.js
```
