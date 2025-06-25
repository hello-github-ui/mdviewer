---
id: 04-AlmaLinux8安装软件
title: 04-AlmaLinux8安装软件
tags: [书签, AlmaLinux, Linux, ES, ElasticSearch, Redis, MySQL]
---

# 一、AlmaLinux8安装ElasticSearch

> ElasticSearch 需要依赖到 JDK，由于我此次安装的是 `**Elasticsearch 8.17.0**` 版本，因此需要 `JDK17+`，包括 `JDK17`。
>
> 注意：`ElasticSearch` 的安装不能使用 **`root`**  用户，必须切换到  **`普通用户` **。

## 1、准备工作

### 1.1、下载离线安装包

我已准备好以下组件：

* [**Elasticsearch 8.17.0**](https://drive.google.com/file/d/1ICe91zxyAQeXvYO-uh73jw6MObhA0wxT/view?usp=sharing)
* [**IK 分词器 8.17.0**](https://drive.google.com/file/d/1z6xWdL_kFlc0H97ufi5T9X7JDBydiCTb/view?usp=sharing)
* [**JDK17**](https://drive.google.com/file/d/1Sh1iw-CDKqKbZAj3VCXTejeQE-KBdoUf/view?usp=sharing)

> 当然jdk和分词器和es也可以从这里下载：
>
> https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
>
> https://release.infinilabs.com/analysis-ik/stable/
>
> https://www.elastic.co/downloads/past-releases/elasticsearch-8-17-0

### 1.2、上传到服务器

将上述三个文件上传到 `/opt/software/` 目录下。

## 2、安装JDK17

### 2.1、解压

```bash
tar -zxvf /opt/software/jdk-17.0.12_linux-x64_bin.tar.gz -C /opt/module/
```

### 2.2、配置环境变量

编辑文件：`sudo vim /etc/profile.d/my_env.sh`

```bash
# JDK
export JAVA_HOME=/opt/module/jdk-17.0.12
export PATH=$PATH:$JAVA_HOME/bin
```

### 2.3、刷新环境配置

`sudo source /etc/profile.d/my_env.sh` `

查看版本：`java -version`

## 3、安装 **Elasticsearch 8.17.0**

### 3.1、解压缩

```bash
tar -zxvf elasticsearch-8.17.0-linux-x86_64.tar.gz -C /opt/module/
```

### 3.2、重命名

```bash
mv /opt/module/elasticsearch-8.17.0 /opt/module/elasticsearch
```

### 3.3、创建数据和日志目录

```bash
sudo mkdir -p /var/lib/elasticsearch /var/log/elasticsearch
```

## 4、**安装 IK 分词器**

```bash
unzip /opt/software/elasticsearch-analysis-ik-8.17.0.zip -d /opt/module/elasticsearch/plugins/analysis-ik
```

## 5、配置**Elasticsearch**

### 5.1、修改 `elasticsearch.yml`

```bash
# 备份文件
cp /opt/module/elasticsearch/config/elasticsearch.yml /opt/module/elasticsearch/config/elasticsearch.yml.bak

# 清空文件
cat /dev/null > /opt/module/elasticsearch/config/elasticsearch.yml

# 编辑文件
vim /opt/module/elasticsearch/config/elasticsearch.yml
```

直接写入如下内容：

```yaml
cluster.name: my-es-cluster
node.name: node-1
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
network.host: 0.0.0.0
discovery.type: single-node
xpack.security.enabled: false  # 禁用安全认证
```

### 5.2、设置权限

```bash
# 创建 普通用户，es 必须不能用 root 启动
sudo useradd elasticsearch

# 设置权限
sudo chown -R elasticsearch:elasticsearch /opt/module/elasticsearch /var/lib/elasticsearch /var/log/elasticsearch
```

### 5.3、**创建 Systemd 服务**

```bash
sudo vim /etc/systemd/system/elasticsearch.service
```

写入以下内容：

```bash
[Unit]
Description=Elasticsearch
After=network.target

[Service]
User=elasticsearch
Group=elasticsearch
Environment="ES_HOME=/opt/module/elasticsearch"
ExecStart=/opt/module/elasticsearch/bin/elasticsearch
Restart=always
LimitNOFILE=65536
LimitMEMLOCK=infinity

[Install]
WantedBy=multi-user.target
```

### 5.4、调整JVM内存

```bash
vim /opt/module/elasticsearch/config/jvm.options
```

修改为：

```bash
-Xms512m
-Xmx512m
```

### 5.5、启动服务

```bash
sudo systemctl daemon-reload
sudo systemctl enable elasticsearch # 设置开机自启服务
sudo systemctl start elasticsearch
sudo systemctl status elasticsearch  # 检查状态
```

### 5.6、验证安装

```bash
curl -X GET "http://localhost:9200"
curl -X POST "http://localhost:9200/_analyze" -H 'Content-Type: application/json' -d'
{
  "analyzer": "ik_smart",
  "text": "中华人民共和国"
}'
```

# 二、AlmaLinux8安装Redis

## 步骤 1. 首先，让我们先确保您的系统是最新的。

```bash
sudo dnf update
sudo dnf install epel-release
```

## 步骤 2. 在 AlmaLinux 8 上安装 Redis。

Redis 现在包含在 CentOS 8 AppStream 存储库中，安装它就像在公园里散步一样。只需运行以下命令：

```bash
sudo dnf install redis
```

安装后，启动 Redis 服务器并启用`systemd`服务，以便服务器在重启后启动：

```bash
sudo systemctl start redis
sudo systemctl enable redis
```

为了验证Redis是否安装成功，我们可以运行以下命令：

```bash
redis-cli ping
```

## 步骤 3. 配置 Redis。

默认安装只允许来自 localhost 或 Redis 服务器的连接并阻止任何外部连接。我们将为来自客户端机器的远程连接配置 Redis：

```bash
sudo vim /etc/redis.conf
```

找到绑定参数并将 127.0.0.1 替换为 0.0.0.0：

```bash
bind 0.0.0.0
```

保存并关闭并重新启动 Redis 服务器：

```bash
sudo systemctl restart redis
```

要登录到 Redis shell，请运行以下命令：

```bash
redis-cli
```

使用命令行客户端从远程主机连接到 Redis 服务器：`redis-cli`

## 步骤 4. 配置防火墙。

打开防火墙端口以允许 Redis 传入流量：

```
sudo firewall-cmd --zone=public --permanent --add-service=redis
sudo firewall-cmd --reload

# 或者彻底关闭防火墙
sudo systemctl stop firewalld
sudo systemctl disable firewalld
```

# 三、AlmaLinux8在线安装MySQL

## 第 1 步：卸载旧版本（可选）

如果之前装过 `mariadb` 或 `mysql` 相关包，建议先卸载：

```bash
sudo yum remove -y mariadb* mysql*
```

## 第 2 步：添加 MySQL 官方 Yum 仓库

```bash
sudo dnf install -y wget
```

### 2.1、查看所有与 mysql 相关的模块：

```bash
dnf module list mysql
```

你应该会看到类似下面的输出：

```bash
Name  Stream  Profiles                   Summary
mysql 8.0     client, server [d]         MySQL Module
mysql 5.7     client, server             MySQL Module
```

其中 `8.0` 旁边有 `[d]` 表示默认启用的模块。

### 2.2、禁用默认的 `mysql` 模块：

```bash
sudo dnf module disable -y mysql
```

### 2.3、继续安装

```bash
wget --no-check-certificate https://repo.mysql.com/mysql80-community-release-el8-1.noarch.rpm
sudo dnf install -y mysql80-community-release-el8-1.noarch.rpm
```

然后验证是否启用了 8.0 源：

```bash
sudo dnf repolist enabled | grep mysql
```

输出应包含 `mysql80-community`。

## 第 3 步：安装 MySQL 8.0

```bash
sudo dnf install -y mysql-community-server --nogpgcheck
```

## 第 4 步：启动并设置为开机启动

```bash
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

## 第 5 步：获取初始 root 密码

```bash
sudo grep 'temporary password' /var/log/mysqld.log
```

复制这个密码，比如：`f2qkkPc,qS>a`

## 第 6 步：安全初始化（设置新密码）

① 登录 MySQL（使用初始临时密码）：

```bash
sudo grep 'temporary password' /var/log/mysqld.log
# 复制出来的临时密码后执行：
mysql -uroot -p
```

② 登录成功后，依次执行以下 SQL：

```bash
-- 降低密码复杂度要求（只对当前会话生效）
SET GLOBAL validate_password.policy = LOW;
SET GLOBAL validate_password.length = 6;

-- 修改 root 密码为 123456
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
```

③ 退出并用新密码测试登录：

```bash
exit
mysql -uroot -p123456
```

## 第 7 步：开启root用户远程访问

登录mysql后，使用 mysql database;

```bash
use mysql;
update user set host='%' where user='root';
flush privileges;
```

## ✅ （可选）第 8 步：修改配置文件（比如改端口、目录等）

配置文件默认在：

```bash
/etc/my.cnf
```

日志文件：

```bash
/var/log/mysqld.log
```

数据目录：

```bash
/var/lib/mysql
```

如你确实想自定义 `datadir` 和 `logdir`，可以改配置 + 修改权限，我也可以单独帮你写。