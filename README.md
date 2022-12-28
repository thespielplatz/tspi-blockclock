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


´´´