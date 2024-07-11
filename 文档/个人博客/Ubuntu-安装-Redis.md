
# <font color=#FF8C00>redis是什么</font>
Redis是常用基于内存的Key-Value数据库，比Memcache更先进，支持多种数据结构，高效，快速。用Redis可以很轻松解决高并发的数据访问问题

# 环境
Ubuntu18.04

# 准备工作
`sudo apt update`

# 安装
使用 apt 从官方 Ubuntu 存储库来安装 Redis：
`sudo apt-get install redis-server`

# 设置密码
* 首先打开Redis配置文件redis.conf
`sudo vi /etc/redis/redis.conf`
* 找到# requirepass foobared这一行，将注释符号#去掉，将后面修改成自己的密码，例如，设置密码为123456
`requirepass 123456`

# 开启远程访问
默认情况下，Redis服务器不允许远程访问，只允许本机访问，所以我们需要设置打开远程访问的功能。
* 打开Redis服务器的配置文件redis.conf
`sudo vi /etc/redis/redis.conf`
* 使用注释符号#注释bind 127.0.0.1这行
```
#注释bind
#bind 127.0.0.1
```

# Redis服务控制
```
sudo systemctl start redis	#启动
sudo systemctl stop redis	#关闭
sudo systemctl restart redis	#重启
```

# 连接测试
重新打开一个终端，直接输入redis-cli通过默认客户端来测试连接，正常情况下返回ping的对应值PONG
```
latinos@latinos-virtual-machine:~$ redis-cli
127.0.0.1:6379> ping
PONG
127.0.0.1:6379>
```

# 注意
修改配置文件之后需要重启Redis服务

![](https://cdn.jsdelivr.net/gh/latin-xiao-mao/img/blog-content/ubuntu-安装-redis/1.jpg)
