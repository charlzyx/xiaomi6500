# tailscale

## WorkDir

/data/other

## install

```sh
curl https://pkgs.tailscale.com/stable/tailscale_1.70.0_arm64.tgz -o tailscale.tgz
tar -zxvf tailscale.tgz
mv tailscale_1.70.0_arm64 tailscale
rm -rf tailscale.tgz
```

## /etc/profile

```sh
echo "source /data/other/autorun.sh" >> /etc/profile
```

## /data/other/tailscale.init

```bash
#!/bin/sh /etc/rc.common

START=99
SERVICE_DAEMONIZE=1

DIR="/data/other/tailscale"
EXEC="/data/other/tailscale/tailscale"
DAEMON="/data/other/tailscale/tailscaled"

start(){
  ${DAEMON} --state=${DIR}/tailscaled.state --socket=/run/tailscale/tailscaled.sock &
  echo "tailscaled running..."
}

stop(){
  ${EXEC} down
  ${DAEMON} --cleanup
  TAILSCALE_PID=$(ps | grep '[tailscale' | awk '{print $1}')
  # 检查是否找到了进程 ID
  if [ -z "$TAILSCALE_PID" ]; then
      echo "没有找到 tailscale 进程。"
      exit 1
  fi
  # 尝试使用 SIGTERM 信号终止进程
  kill "$TAILSCALE_PID"
}

restart(){
  ${EXEC} up --advertise-exit-node --advertise-routes=10.5.6.0/24
}
```

## /data/other/autorun.sh

```sh
#!/bin/sh

cp /data/other/tailscale.init /etc/init.d/tailscale

/etc/init.d/tailscale start
/etc/init.d/tailscale restart

# cp /data/other/nginx/* /etc/nginx/conf.d/

# nginx -s reload

```
