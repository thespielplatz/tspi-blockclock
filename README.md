# Blockclock
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
