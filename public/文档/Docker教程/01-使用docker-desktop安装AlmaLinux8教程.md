> 前提：已经在windows中安装好 docker-desktop 软件。

## 1.新建 `entrypoint` 脚本

使用 `git bash` 随机进入一个windows下的目录，创建一个新的目录：

```bash
mkdir alma-docker
```

然后进入这个目录 `cd alma-docker`，新建 `entrypoint.sh` 文件：

```bash
#!/bin/bash
set -e

# 如果 /etc/ssh 下的 host keys 不存在则生成
if [ ! -f /etc/ssh/ssh_host_rsa_key ]; then
    echo "Generating SSH host keys..."
    ssh-keygen -A
fi

exec /usr/sbin/sshd -D
```

确保保存后给这个脚本增加执行权限（在 Windows 上可以在 Git Bash 或 WSL 下执行 `chmod +x entrypoint.sh`）。

## 2.编写 `Dockerfile`

创建一个名为 `Dockerfile` 的文件，内容如下：

```dockerfile
# 基于 AlmaLinux 8 官方基础镜像
FROM almalinux:8

# 更新系统并安装 openssh-server、vim、net-tools、iproute、bash-completion 及 passwd 工具
RUN dnf update -y && \
    dnf install -y openssh-server vim net-tools iproute bash-completion passwd && \
    dnf clean all

# 设置 root 密码（请将 123456 替换为你自己的密码）
RUN echo "root:123456" | chpasswd

# 创建 sshd 运行所需目录
RUN mkdir -p /var/run/sshd

# 复制 entrypoint 脚本到容器内，并赋予执行权限
COPY ./entrypoint.sh /entrypoint.sh
# Dockerfile 中添加一行命令来移除 CR 字符
RUN sed -i 's/\r$//' /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 暴露 SSH 端口
EXPOSE 22

# 使用 entrypoint 脚本启动容器
ENTRYPOINT ["/entrypoint.sh"]
```

## 3.编写 `docker-compose.yml` 文件

使用下面的 `docker-compose.yml` 文件来构建并运行容器，容器名指定为 `alma-docker`，端口映射为宿主机 2222 对应容器 22 端口：

```yaml
version: '3'
services:
  alma:
    build: .
    image: alma-docker
    container_name: alma-docker
    ports:
      - "2222:22"
    privileged: true
```

## 4.构建并启动

在包含 Dockerfile、entrypoint.sh 和 docker-compose.yml 的目录下，执行：

```bash
docker-compose up -d --build
```

这样，Docker Compose 会重新构建镜像，并在启动时通过 entrypoint 脚本生成 host keys，然后启动 sshd 服务。

## 5.用Xshell登录

* 主机：宿主机的 IP 地址（localhost也行）
* 端口：2222
* 用户名：root
* 密码：123456