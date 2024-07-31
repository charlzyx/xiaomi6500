# PVE 安装

## 系统安装

1. 下载 ISO 镜像文件
   > 官方: https://www.proxmox.com/en/downloads
   > 清华源: https://mirrors.tuna.tsinghua.edu.cn/proxmox/iso/
2. 制作启动盘 Ventoy
   > https://ventoy.net/cn/download.html
3. 有线安装
   > BIOS 修改 U 盘启动

## 系统设置

/etc/apt/sources.list

```bash
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware

# 以下安全更新软件源包含了官方源与镜像站配置，如有需要可自行修改注释切换
deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware
```

/etc/apt/sources.list.d/pve-no-subscription.list

```bash
deb https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian/pve bookworm pve-no-subscription
```

CT Templates

```bash
cp /usr/share/perl5/PVE/APLInfo.pm /usr/share/perl5/PVE/APLInfo.pm_back
sed -i 's|http://download.proxmox.com|https://mirrors.tuna.tsinghua.edu.cn/proxmox|g' /usr/share/perl5/PVE/APLInfo.pm

```

更新和基础依赖

```bash
mv /etc/apt/source.list.d/pve-enterprise.list /etc/apt/source.list.d/pve-enterprise.list.bak
mv /etc/apt/source.list.d/ceph.list /etc/apt/source.list.d/ceph.list.bak
apt update

apt install unzip wpasupplicant parted zsh -y
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
apt install git curl unzip zsh gpg

# 切换zsh
chsh -s $(which zsh)
# 安装 starship
curl -sS https://starship.rs/install.sh | sh
# eval "$(starship init zsh)"
echo 'eval "$(starship init zsh)"' >> ~/.zshrc
echo 'source ~/.bashrc' >> ~/.zshrc
# 安装 nvim 最新版
wget https://github.com/neovim/neovim/releases/download/stable/nvim-linux64.tar.gz
tar -xvzf nvim-linux64.tar.gz &&  mv nvim-linux64 nvim && mv nvim /usr/local/
ln -s /usr/local/nvim/bin/nvim /usr/local/bin/nvim
ln -s /usr/local/nvim/bin/nvim /usr/local/bin/vim
ln -s /usr/local/nvim/bin/nvim /usr/local/bin/vi
timedatectl set-timezone Asia/Shanghai
```

配置 wifi /etc/network/interface

```bash

auto vmbr0
iface vmbr0 inet static
      address 10.5.6.6/24
      gateway 10.5.6.1
      bridge-ports en0sp1
      bridge-stp off
      bridge-fd 0
```

分区

```bash
parted /dev/sda

mkpart
> start 150G
end 100%

```

/etc/fstab

```bash
/dev/sda4 /home/cloud ext4 defaults 0 0
```

/etc/network/wifi.conf

```bash
ctrl_interface=/var/run/wpa/supplicant #运行位置
update_config=1 #允许在运行中由进程自动修改配置

network={
  ssid="WiFi"
  psk="XXXXXX"
  priority=1 #优先连接
}
```

smb

```bash
apt install samba -y
# 共享
mkdir /home/cloud
chmod 777 /home/cloud

# 手动输入密码
smbpasswd -a chao


systemctl start smbd
systemctl enable smbd
```

/etc/samba/smb.conf

```bash
cloud
path = /home/cloud
read only = no
writeable = yes
guest ok = true

```

/etc/pve/lxc/120.conf

```bash
arch: amd64
cmode: shell
cores: 4
hostname: dl
memory: 1024
mp0: /home/cloud/xunlei,mp=/xunlei/data
net0: name=eth0,bridge=vmbr0,gw=10.10.10.1,hwaddr=DE:6F:E9:FC:AB:7B,ip=10.10.10.120/24,ip6=auto,type=veth
ostype: alpine
rootfs: local-lvm:vm-234-disk-0,size=4G
swap: 0
```
