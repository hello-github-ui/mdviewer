> 这里是一份在 AlmaLinux 8 上安装 PostgreSQL 14 的完整步骤：🚀
>
> 使用 root 用户操作

1️⃣ **更新系统软件包**

```bash
yum update -y --nogpgcheck
```

2️⃣ **安装 PostgreSQL 官方仓库**
AlmaLinux 8 使用 PostgreSQL 官方提供的模块安装：

```bash
dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm --nogpgcheck
```

3️⃣ **禁用系统自带的 PostgreSQL 模块（非常重要，否则可能会安装旧版本）**

```bash
dnf -qy module disable postgresql
```

4️⃣ **安装 PostgreSQL 14**

```bash
dnf install -y postgresql14 postgresql14-server --nogpgcheck
```

5️⃣ **初始化数据库**

```bash
/usr/pgsql-14/bin/postgresql-14-setup initdb
```

6️⃣ **设置 PostgreSQL 开机自启并启动服务**

```bash
systemctl enable postgresql-14
systemctl start postgresql-14
```

7️⃣ **检查 PostgreSQL 服务状态**

```bash
systemctl status postgresql-14
```

8️⃣ **切换到 PostgreSQL 用户并连接数据库**

```bash
sudo -i -u postgres
psql
```

9️⃣ **简单测试 PostgreSQL（可选）**
在 PostgreSQL 命令行里执行：

```plsql
CREATE DATABASE testdb;
\l                   -- 查看数据库列表
\q                   -- 退出 psql
```

🔟 **开放远程访问（如需要）**
编辑 PostgreSQL 配置文件：

```bash
vi /var/lib/pgsql/14/data/postgresql.conf
# # 在 切换到 postgres 用户后执行 vi /var/lib/pgsql/14/data/postgresql.conf 时，可能需要密码，此时需要切换到 root 用户再执行该命令
```

修改监听地址：

```ini
listen_addresses = '*'
```

编辑访问控制文件：

```bash
vi /var/lib/pgsql/14/data/pg_hba.conf
```

添加一行（允许所有 IP 访问）：

```ini
host    all             all             0.0.0.0/0               md5
```

重启 PostgreSQL 服务：

```bash
systemctl restart postgresql-14
```

1️⃣1️⃣ **开放防火墙端口（如需要）**

```
firewall-cmd --permanent --add-port=5432/tcp
firewall-cmd --reload
```

1️⃣2️⃣ **设置 PostgreSQL 用户密码（可选）**

```bash
sudo -i -u postgres
psql
```

在 PostgreSQL 控制台中执行：

```plsql
ALTER USER postgres WITH PASSWORD '123456';
\q
```

✨ 完成安装！现在 PostgreSQL 14 已成功运行。你可以通过命令行、数据库客户端或代码进行访问。如果中间有报错或需要优化配置，告诉我，我们继续搞定！🚀✨