> 前言：已经将 `webPortals-0.0.1-SNAPSHOT.jar` jar包上传到目标机器上了。该应用程序的目标端口使用 `9090`

## 1.安装Java（推荐OpenJDK8或11）

```bash
# 更新软件源
sudo apt update

# 安装 OpenJDK 8（如果你项目要求 8）
sudo apt install openjdk-8-jdk -y

# 或者安装 OpenJDK 11（推荐版本）
sudo apt install openjdk-11-jdk -y

# 验证安装
java -version
```

## 2.安装Nginx

### 第一步：安装Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 第二步：配置Nginx转发

编辑默认站点配置文件（或新建一个）：

```bash
sudo vim /etc/nginx/sites-available/default
```

将文件内容替换或添加为如下内容（注意保留 `server` 结构）：

```nginx
server {
    listen 80;
    server_name www.flyx-logistics.com.cn;

    location / {
        proxy_pass http://127.0.0.1:9090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> ### 整体作用：
>
> 这段配置定义了一个监听在 **HTTP（80端口）** 的 Nginx 服务器，将来自 `https://www.flyx-logistics.com.cn/` 的访问请求**反向代理**到本地的 **Spring Boot 程序（9090端口）**。
>
> * server_name www.flyx-logistics.com.cn;  指定服务器匹配的域名，当请求是这个域名时才会使用这个配置块。
> * 定义根路径 `/` 的反向代理规则。
> * `proxy_pass` 表示将所有请求转发到本地的 `9090` 端口，即你的 Spring Boot 应用。
> * `Host`：原请求的主机名。
> * `X-Real-IP`：客户端真实 IP 地址，Spring Boot 就可以通过这些头部识别客户端信息。

### 第三步：测试并重启 Nginx

```bash
sudo nginx -t         # 测试配置是否正确
sudo systemctl restart nginx
```

### 第四步：检查防火墙（可选）

如果你启用了 `ufw` 防火墙，需要放行 80 端口：

```bash
sudo ufw allow 80
```

### 第五步：确认域名解析

确保你的域名 `flyx-logistics.com.cn` 已解析到该服务器的公网 IP。你可以使用：

```bash
ping flyx-logistics.com.cn
```

来确认是否指向了你的服务器 IP。

> 启用Nginx开机自启动：
>
> `sudo systemctl enable nginx`
>
> 查看 Nginx 状态：
>
> `sudo systemctl status nginx`

## 📌 常见位置

- Nginx 默认网站目录：`/var/www/html/`
- 配置文件：`/etc/nginx/nginx.conf`
- 站点配置：`/etc/nginx/sites-available/` 和 `/etc/nginx/sites-enabled/`

## 3.创建启停脚本

```bash
vim webPortals.sh
```

写入下面的内容：

```bash
#!/bin/bash

APP_NAME="webPortals-0.0.1-SNAPSHOT.jar"
PID_FILE="webPortals.pid"
LOG_FILE="webPortals.log"
PORT=9090

start() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo "⚠️ 应用已在运行 (PID=$PID)"
            exit 1
        fi
    fi

    echo "🚀 启动应用..."
    nohup java -jar $APP_NAME --server.port=$PORT > $LOG_FILE 2>&1 &
    echo $! > $PID_FILE
    echo "✅ 应用已启动 (PID=$!)"
}

stop() {
    if [ ! -f "$PID_FILE" ]; then
        echo "⚠️ 未找到 PID 文件，应用可能未运行。"
        exit 1
    fi

    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "🛑 正在停止应用 (PID=$PID)..."
        kill $PID
        rm -f "$PID_FILE"
        echo "✅ 应用已停止。"
    else
        echo "⚠️ PID $PID 的进程不存在。"
        rm -f "$PID_FILE"
    fi
}

status() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo "✅ 应用正在运行 (PID=$PID)"
        else
            echo "⚠️ 应用未运行，但 PID 文件存在。"
        fi
    else
        echo "ℹ️ 应用未运行。"
    fi
}

restart() {
    echo "🔁 重启应用..."
    stop
    sleep 2
    start
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    *)
        echo "用法: $0 {start|stop|restart|status}"
        exit 1
esac
```

添加执行权限：

```bash
chmod +x webPortals.sh

./webPortals.sh start     # 启动
./webPortals.sh stop      # 停止
./webPortals.sh restart   # 重启
./webPortals.sh status    # 查看状态
```

## 补充

那假设，我本地有两个springboot的程序，我都希望通过 flyx-logistics.com.cn 来访问呢？这种的话有办法么？

是的，你完全可以通过一个域名（如 `flyx-logistics.com.cn`）访问多个 Spring Boot 应用，只需要根据 **路径（location）** 或 **子域名** 做区分。以下是两种常见方式：

### ✅ 方案一：**按路径区分**

比如：

- `flyx-logistics.com.cn/app1` → 映射到第一个应用（端口9090）
- `flyx-logistics.com.cn/app2` → 映射到第二个应用（端口9091）

**示例配置：**

```nginx
server {
    listen 443 ssl;
    server_name flyx-logistics.com.cn;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location /app1/ {
        proxy_pass http://127.0.0.1:9090/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /app2/ {
        proxy_pass http://127.0.0.1:9091/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

> 注意事项：Spring Boot 应用需支持以 `/app1` 或 `/app2` 为前缀的访问路径，或做 URL 前缀适配（比如加 `server.servlet.context-path=/app1`）。

### ✅ 方案二：**按子域名区分**

比如：

- `app1.flyx-logistics.com.cn` → 第一个应用
- `app2.flyx-logistics.com.cn` → 第二个应用

**前提：你要能控制 DNS 配置**，添加 `app1.` 和 `app2.` 的子域名解析。

**Nginx 配置示例：**

```nginx
server {
    listen 443 ssl;
    server_name app1.flyx-logistics.com.cn;

    ssl_certificate /path/to/app1.pem;
    ssl_certificate_key /path/to/app1.key;

    location / {
        proxy_pass http://127.0.0.1:9090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name app2.flyx-logistics.com.cn;

    ssl_certificate /path/to/app2.pem;
    ssl_certificate_key /path/to/app2.key;

    location / {
        proxy_pass http://127.0.0.1:9091;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```