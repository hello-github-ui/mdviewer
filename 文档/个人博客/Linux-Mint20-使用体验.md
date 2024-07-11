---
title: Linux Mint20 使用体验
categories: 笔记
tags:
  - Linux
  - Mint
cover: 'https://pic.imgdb.cn/item/61ab5b682ab3f51d9166eeb3.jpg'
abbrlink: 5426
date: 2021-12-04 19:10:18
top_img:
highlight_shrink:
aside:
description:
---

> 上周我把我的华硕笔记本重装成Linux Mint20系统了，以后我就不打算使用windows了，太流氓了。
> 至于系统怎么装的，就不细说了，因为坑之前装过windows的电脑装想直接装Linux系统坑还是太多了，其因有以下几点：其一，windows系统下基本是
> 多个分区，例如：通常有c，d，e盘等，而这就是一个巨坑，因为Linux可没有分区盘符的概念，它是从内核到上层软件都是一个FS系统，只有一个分区系统；其二，windows下常用的软件在目前水平下的linux中不好装，即使侥幸安装成功也会有各种各样的bug，就拿微信来说吧，实在是不好安装，需要各种插件依赖下载一大堆，成功安装之后，在输入汉字字符时，你是看不到你打的是什么字的，只有在发送之后才能看到（天啊，不敢相信）其三，翻墙代理软件实在是不好安装，相比windows，安卓，mac下的软件生态，linxu下实在是用户量颇少，生态更不好。其他的原因就更不说了，当你细细使用之后就能体验到了。所以说Linux不适合普通人使用
> 下面来说一下常用软件怎么安装吧？

# MySQL8 的安装

我们在下载一个软件之前首先要做的一件事是什么呢？对喽，先看一下电脑上有没有已安装该软件了，若有则彻底卸载它。来，就让我们来体验一下这个流程吧。

## 检测是否已安装MySQL

```shell
dpkg  --list  | grep mysql
```
通过上面的命令查看，有什么就使用命令卸载掉什么

## 卸载MySQL

这里以上一步查看出来的 mysql-client-core-8.0 为例来卸载掉它：
```shell
# 卸载命令下面两条都可以
sudo apt-get autoremove  --purge mysql-client-core-8.0
sudo apt-get remove mysql-common
```

## 最后清除残留数据

```shell
dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P
```

## 更新软件库

```shell
sudo apt update
```

## 安装MySQL服务端

```shell
sudo apt install mysql-server
```
注意，该命令会默认下载当前软件源里面的最新版。

## 安装依赖

依赖里面就包含了MySQL客户端了。
```shell
sudo apt install libmysqlclient-dev
```

## 检查安装是否成功

查看mysql是否安装成功，及mysql服务
```shell
sudo netstat -tap | grep mysql
```

> 如果出现“无此命令”，输入命令 `sudo apt install netstat`

## 设置root密码

### 切换root用户

`sudo su`

### 进入mysql

在上一步切换为 root 用户之后，直接输入命令：
```shell
mysql # 直接输入mysql即可进入连接上mysql服务端了，当然你也可以通过 mysql -u root -p 进入，注意：不需要输入密码，直接 回车 即可。
```

### 修改root密码并配置数据库root权限

```shell
use mysql;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
flush privileges; # 设置生效
```
之后退出 .

### mysql服务管理

```shell
sudo service mysql status # 查看服务状态
sudo service mysql start # 启动服务
sudo service mysql stop # 停止服务
sudo service mysql restart # 重启服务

sudo cat /etc/mysql/debian.cnf # 查看密码

# mysql 的安装目录，在这个目录下你便可以看到my.cnf配置文件
/ect/mysql/
```
