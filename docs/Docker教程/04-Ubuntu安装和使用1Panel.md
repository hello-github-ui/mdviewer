---
id: Ubuntu安装和使用1Panel
title: Ubuntu安装和使用1Panel
tags: [Docker, Linux, Ubuntu]
---

# Ubuntu离线安装Docker

## 一、离线包制作

- 首先要在一台干净能联网的机器上制作，注意以下命令都使用 `非root` 用户执行。

### 1.更新系统

```bash
sudo apt-get update
```

### 2.安装必要的工具

```bash
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

### 3.添加Docker的官方GPG密钥

这里用的是清华源

```bash
curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
```

### 4.设置Docker存储库

```bash
sudo add-apt-repository "deb [arch=amd64] https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
# 第二个存储库
sudo add-apt-repository "deb [arch=amd64] https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/ubuntu $（lsb_release -cs） 稳定"
```

### 5.更新APT包索引

```bash
sudo apt-get update
```

### 6.下载Docker CE和相关依赖

创建一个目录来存放下载的包：

```bash
mkdir docker-ce-offline
cd docker-ce-offline
```

下载Docker CE和依赖包：

```bash
apt-get download docker-ce
apt-get download $(apt-cache depends docker-ce | grep Depends | sed "s/.*ends:\ //" | tr '\n' ' ')
```

### 7.打包离线安装包

将所有打包到一个压缩文件中：

```bash
tar -czvf docker-ce-offline.tar.gz docker-ce-offline/
```

<font color="red">如果是本机上安装的话，不需要进行步骤7，直接往下执行。</font>

## 二、在目标系统上离线安装Docker CE

### 1.将压缩文件复制到目标系统上，然后解压

```bash
tar xzvf docker-ce-offline.tar.gz
```

### 2.安装

```bash
sudo dpkg -i *.deb
```

### 3.查看版本

```bash
docker --version
```

### 4.把解压包中的测试文件导入

```bash
sudo docker load < hello-world.tar
```

### 5.查看影像是否存在

```bash
sudo docker images
```

### 6.运行测试

```bash
sudo docker run hello-world
```

## 三、配置Docker服务启动并配置开机自启

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

# 安装1Panel

## 1.系统更新

在安装1Panel之前，先确保系统已经更新：

```bash
sudo apt update && sudo apt upgrade -y
```

## 2.安装必要的依赖

```bash
sudo apt install curl wget -y
```

## 3.官方一键安装脚本

```bash
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && sudo bash quick_start.sh
```

## 4.查看1Panel服务状态

1Panel安装脚本会配置一个服务来管理1Panel，如果启动1Panel服务时出现问题，可以尝试手动重启服务：

```bash
sudo systemctl restart 1panel
sudo systemctl status 1panel
```

查看服务状态是否正常启动。