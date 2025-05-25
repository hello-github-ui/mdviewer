---
id: Tomcat如何快速部署war包程序
title: Tomcat如何快速部署war包程序
tags: [个人博客]
---


# Tomcat 中如何部署war包
这里我使用最快速的一种方式，即通过修改 `conf/server.xml` 文件来实现

```xml
<Context docBase="/home/xiaohua/my-app/yaoqishan" path="/" debug="0" reloadable="false"/>
```
在 server.xml 最下面添加如上一行代码即可成功实现将 yaoqishan.war 包部署到 tomcat 中，
启动 tomcat ，访问 http://localhost:8080/ 即可访问成功。
之后每次修复bug后，只需要将你的war包上传到 `/home/xiaohua/my-app/yaoqishan` 目录下替换掉原有的war包即可。

> 若是在 windows 环境下，只需要修改如上代码为：
```xml
<Context docBase="E:/github-project/yaoqishan/target/yaoqishan" path="/" debug="0" reloadable="false"/>
```
即可


# linux 下开放端口
## 查看开放的端口
```shell
firewall-cmd --list-all
```

## 开放端口
```shell
firewall-cmd --add-port=8080/tcp --permanent
```

## 立即刷新配置
```shell
firewall-cmd --reload
```

## 移除指定端口
```shell
firewall-cmd --permanent --remove-port=8080/tcp
```

## 查看防火墙状态
```shell
systemctl status firewalld
```

## 开启防火墙
```shell
systemctl start firewalld
```

## 关闭防火墙
```shell
systemctl stop firewalld
```

![](https://pic.imgdb.cn/item/60a283596ae4f77d357d0d3d.jpg)
