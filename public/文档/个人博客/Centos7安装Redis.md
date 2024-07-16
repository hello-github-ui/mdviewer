# 1. 下载
从官网下载redis压缩包到本地

# 2. 解压
`tar -zxvf redis-6.0.6.tar.gz`

# 3. 升级 gcc
> 自 redis 6.0.0 之后，编译 redis 需要支持 C11 特性，C11 特性在 4.9 中被引入。
  Centos7 默认 gcc 版本为 4.8.5，所以需要升级gcc版本。

解决方式：
```shell script
yum -y install gcc gcc-c++ make tcl
yum -y install centos-release-scl
yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils
scl enable devtoolset-9 bash
```
# 4. 编译
通过make来编译，make是自动编译，会根据Makefile中描述的内容来进行编译。
```shell script
cd redis-6.0.6
make
```
可以看到在src目录下生成了几个新的文件。

# 5. 安装
```shell script
make install
```
实际上，就是将这个几个文件加到/usr/local/bin目录下去。这个目录在Path下面的话，就可以直接执行这几个命令了。

可以看到，这几个文件就已经被加载到bin目录下了

# 6. 测试
```shell script
redis-server
redis-cli
```

# 7. 设置redis服务器后台启动
前面在启动redis服务器后，都是在前台启动的，需要重新启动一个客户端来进行登陆操作。这样非常不方便，
所以，我们需要设置后台启动，修改 redis.conf文件。
daemonize no
修改为：
`daemonize yes`

# 8. 卸载redis
卸载redis服务，只需把/usr/local/bin/目录下的redis删除即可
```shell script
rm -rf /usr/local/bin/redis*
```
甚至可以把解压包也删除掉
```shell script
rm -rf /root/redis-stable
```
同时可以参考我的另一篇redis 主从配置文章。

