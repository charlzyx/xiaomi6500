# tailscale

## WorkDir

/data/other

## install

```sh
cd /data/other
curl https://pkgs.tailscale.com/stable/tailscale_1.70.0_arm64.tgz -o tailscale.tgz
tar -zxvf tailscale.tgz
mv tailscale_1.70.0_arm64 tailscale
rm -rf tailscale.tgz
```

##  /data/ShellCrash/misnap_init.sh

```sh
source /data/other/autorun.sh
```

## /data/other/tailscale.procd

```bash
#!/bin/sh /etc/rc.common

START=99
SERVICE_DAEMONIZE=1
SERVICE_WRITE_PID=1
PIDFILE=/var/run/tailscaled.pid

TAIL="/data/other/tailscale"

source ${TAIL}/systemd/tailscaled.defaults

start(){
    start-stop-daemon  -S -b -p $PIDFILE -m \
      -x $TAIL/tailscaled -- \
      --port=$PORT \
      --state=$TAIL/tailscaled.state

}

stop(){
  start-stop-daemon  -K  -p $PIDFILE -t
}

restart(){
  ${TAIL}/tailscale up --advertise-exit-node --advertise-routes=10.5.6.0/24
}
```

## /data/other/autorun.sh

```sh
#!/bin/sh

cp ./tailscale.procd /etc/init.d/tailscale

/etc/init.d/tailscale start
/etc/init.d/tailscale restart

cp ./nginx.conf.d/* /etc/nginx/conf.d/

nginx -s reload

```
