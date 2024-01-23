# set up blocktris as systemd service

setup according to https://domoticproject.com/creating-raspberry-pi-service/

## helpful commands

```
sudo vi /lib/systemd/system/blocktris.service
sudo cp docs/raspi-service/blocktris.service /lib/systemd/system/blocktris.service

sudo systemctl start blocktris.service
sudo systemctl stop blocktris.service
sudo systemctl enable blocktris.service
sudo systemctl status blocktris.service
sudo systemctl disable blocktris.service

systemd-analyze plot > output.svg
```
