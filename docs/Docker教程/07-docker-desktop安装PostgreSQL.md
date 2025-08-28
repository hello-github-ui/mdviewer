# docker-desktop安装PostgreSQL

## 1、准备工作

确保已经安装好了 `Docker Desktop`。

## 2、拉取 `PostgreSQL` 镜像

```bash
docker pull postgres
```

## 3、创建本地目录

为了实现数据持久化，我们需要创建一个本地目录来存储 `PostgreSQL`的数据，这样即使机器重启后，数据也不会丢失。运行以下命令来创建目录（根据你的需求来修改路径）：

```bash
# windows 写法，若其中一级目录不存在，Windows会自动创建它
mkdir C:/Users/EDY/software/docker-entry/postgresql/data
# linux写法
mkdir -p /path/to/postgres/data
```

## 4、运行 `PostgreSQL` 容器并挂载本地卷

使用以下命令运行 PostgreSQL 容器，并将本地目录挂载到容器内的数据目录：

```bash
docker run -d -p 5432:5432 --name mypostgres -e POSTGRES_PASSWORD=123456 -v C:/Users/EDY/software/docker-entry/postgresql/data:/var/lib/postgresql/data postgres
```

这条命令的含义如下：

* `-d`：后台运行容器。
* `-p 5432:5432`：将容器的 `5432` 端口映射到宿主机的 5432 端口，前面是宿主机，后面是容器。
* `--name mypostgres`：为容器命名为 `mypostgres`。
* `-e POSTGRES_PASSWORD=123456`：设置 `PostgreSQL` 默认用户 `postgres` 的密码。
* `-v C:/Users/EDY/software/docker-entry/postgresql:/var/lib/postgresql/data`：将本地目录挂载到容器内的 `/var/lib/postgresql/data` 目录，实现数据持久化。

## 5、验证容器运行状态

```bash
docker ps
```

## 6、连接到 `PostgreSQL` 数据库

使用 `navicat` 连接。

![image-20250828131920977](/assets/2025/08/28/image-20250828131920977.png)