> 在 `Docker-Desktop` 上安装轻量版 `Oracle` 数据库，并创建用户，并用navicat连接。

## 1、拉取 `Oracle Database Express Edition 镜像`

```bash
docker pull gvenzl/oracle-xe:latest
```

## 2、创建并运行`Oracle`容器

```bash
docker run -d \
  --name oracle-xe \
  -p 1521:1521 \
  -p 5500:5500 \
  -e ORACLE_PASSWORD=123456 \
  -v oracle-xe-data:/opt/oracle/oradata \
  gvenzl/oracle-xe:latest
```

参数说明：

* `-p 1521:1521`：映射数据库端口
* `-p 5500:5500`：映射 `Oracle Enterprise Manager` 端口，属于Oracle的web管理界面
* `-e ORACLE_PASSWORD`：设置 `SYS`、`SYSTEM`用户密码
* `-v oracle-xe-data`：持久化数据卷

## 3、创建最高权限用户

等待容器启动完成后（通常需要2~3分钟），连接数据库创建用户

```bash
# 进入容器
docker exec -it oracle-xe sqlplus sys/123456@localhost:1521/XE as sysdba
```

在 `SQL*Plus`中执行：

```sql
-- 方案1：使用默认表空间（推荐用于开发环境）
-- 创建用户
CREATE USER admin_user 
IDENTIFIED BY 123456 
DEFAULT TABLESPACE USERS 
TEMPORARY TABLESPACE TEMP
QUOTA UNLIMITED ON USERS;

-- 授予权限
GRANT DBA TO admin_user;
GRANT CONNECT, RESOURCE TO admin_user;
GRANT CREATE SESSION TO admin_user;
GRANT UNLIMITED TABLESPACE TO admin_user;

-- 授予系统权限
GRANT CREATE ANY TABLE TO admin_user;
GRANT ALTER ANY TABLE TO admin_user;
GRANT DROP ANY TABLE TO admin_user;
GRANT SELECT ANY TABLE TO admin_user;
GRANT INSERT ANY TABLE TO admin_user;
GRANT UPDATE ANY TABLE TO admin_user;
GRANT DELETE ANY TABLE TO admin_user;

-- 查看所有服务名
SELECT name FROM v$services;

-- 退出
EXIT;
```

## 4、配置 `Navicat` 连接

在 `Navicat` 中创建新连接：

连接设置：

* 连接名：`Oracle XE Local`
* 主机：`localhost` 或 `127.0.0.1`
* 端口：`1521`
* 服务名：`XE`
* 用户名：`admin_user`
* 密码：`123456`

高级设置：

* 连接类型：`Service Name`
* 角色：`Normal`

![image-20250830114641963](/assets/2025/08/30/image-20250830114641963.png)

## 5、验证安装

检查容器状态：

```bash
docker ps
docker logs oracle-xe
```

测试链接：

```bash
docker exec -it oracle-xe sqlplus admin_user/123456@localhost:1521/XE
```

## 6、常用管理命令

```bash
# 启动容器
docker start oracle-xe

# 停止容器
docker stop oracle-xe

# 重启容器
docker restart oracle-xe

# 查看容器日志
docker logs -f oracle-xe

# 备份数据
docker exec oracle-xe exp admin_user/admin_password file=/tmp/backup.dmp
```

## 7、如果遇到连接问题

### 7.1、检查监听器状态：

```bash
docker exec -it oracle-xe lsnrctl status
```

### 7.2、修改监听器配置（如需要）：

```bash
docker exec -it oracle-xe vi /opt/oracle/product/21c/dbhomeXE/network/admin/listener.ora
```

## 8、注意事项

1. **防火墙**：确保 Docker Desktop 的端口映射正常工作
2. **内存**：Oracle XE 至少需要 `2GB` 内存
3. **等待时间**：首次启动需要等待数据库完全初始化
4. **密码策略**：Oracle 有密码复杂度要求，建议使用包含大小写字母、数字的8位以上密码
5. **持久化**：使用数据卷确保数据不会因容器删除而丢失

完成这些步骤后，你就可以通过 Navicat 连接到 Oracle 数据库，并使用具有最高权限的 admin_user 用户进行各种数据库操作了。

## 9、补充知识

### 9.1、Oracle 服务名（Service Name）的概念

#### ①、XE 服务名的由来

**XE** 是 Oracle Database Express Edition 的默认服务名：

- **X**E = Express **E**dition
- 这是 Oracle 在安装 XE 版本时自动创建的默认服务名
- 类似于实例标识符，用于区分同一服务器上的不同数据库实例

#### ②、Oracle 的层级结构

```bash
Oracle 实例 (Instance)
└── 数据库 (Database)
    └── 服务 (Service)
        └── 模式 (Schema)
            └── 表 (Tables)
```

### 9.2、MySQL vs Oracle 的架构差异

#### MySQL 架构

```
MySQL 服务器
├── 数据库1 (Database1)
│   ├── 表1
│   └── 表2
├── 数据库2 (Database2)
│   ├── 表1
│   └── 表2
└── ...
```

#### MySQL 连接方式：

```
主机:端口/数据库名
例如：localhost:3306/mydb
```

#### Oracle 架构

```
Oracle 实例
└── 容器数据库 (CDB)
    ├── 系统模式 (SYS, SYSTEM)
    ├── 服务1 (Service1)
    │   └── 模式 (Schemas)
    ├── 可插拔数据库1 (PDB1)
    │   └── 模式 (Schemas)
    └── 可插拔数据库2 (PDB2)
        └── 模式 (Schemas)
```

#### Oracle 连接方式：

```
主机:端口/服务名
例如：localhost:1521/XE
```

### 9.4、为什么 MySQL 没有服务名概念？

#### ①. 设计哲学不同

- **MySQL**：简单直接，一个服务器实例 = 多个独立数据库
- **Oracle**：企业级，一个实例可以承载多个服务，支持更复杂的多租户架构

#### ②. 历史发展

- **MySQL**：起源于简单的 Web 应用需求
- **Oracle**：起源于大型企业应用，需要支持复杂的业务隔离

#### ③. 多租户支持

```
-- Oracle 支持这样的架构
实例
├── 服务A (客户A的业务)
├── 服务B (客户B的业务)  
└── 服务C (测试环境)

-- MySQL 通常这样做
MySQL实例1 (客户A)
MySQL实例2 (客户B)
MySQL实例3 (测试)
```

