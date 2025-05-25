---
id: Ubuntu修改静态IP
title: Ubuntu修改静态IP
tags: [个人博客]
---


> Ubuntu 修改静态IP的方式与我们常用的‘红帽系linux’（比如centos）有很大区别，因此记录一下。

**注意：适用于ubuntu18.04及以后版本**
先切换到 root 账号，然后执行下列操作。

# 先查看自己的网卡名称
> 输入：ifconfig，我此处的网卡名称是 ens33（注意，你的可能不一样，记住你的en开头的名称，下面修改会用到）

# 修改ubuntu18.04的网络配置文件
> vim /etc/netplan/01-network-manager-all.yaml

```shell
# Let NetworkManager manage all devices on this system
network:
 version: 2
 renderer: NetworkManager
 ethernets:
  ens33: #配置的网卡名称,使用ifconfig -a查看得到
   dhcp4: no #dhcp4关闭
   addresses: [10.144.144.10/24] #设置本机IP及掩码
   gateway4:  10.144.144.2 #设置网关
   nameservers:
    addresses: [10.144.144.2] #设置DNS
```
修改为如上内容即可，可以改为你自己的ip

# 生效
```shell
netplan apply
```

然后重启你的linux即可。
