## Redis主从复制

redis的主从复制概念和mysql的主从复制大概类似。一台主机master，一台从机slaver。master主机数据更新后根据配置和策略，自动同步到slaver从机，Master以写为主，Slaver以读为主。

![](https://img.imgdb.cn/item/60601b8a8322e6675cccfc55.jpg)

## 主要用途

* 读写分离：适用于读多写少的应用，增加多个从机，提高读的速度，提高程序的并发性
* 数据容灾恢复：从机复制主机的数据，相当于数据备份，如果主机数据丢失，那么可以通过从机存储的数据进行恢复
* 高并发、高可用集群实现的基础：在高并发的场景下，就算主机挂了，从机可以实现主从切换，从机自动成为主机对外提供服务

## 一主多从配置

![](https://img.imgdb.cn/item/60601c408322e6675ccd5f78.jpg)

## 环境准备

我们用一台机器模拟三个机器，

将下载下来的redis复制三份

```shell
cp -R redis-5.0.3 redis01
cp -R redis-5.0.3 redis02
cp -R redis-5.0.3 redis03
```

如下图所示：

![](https://img.imgdb.cn/item/60602b838322e6675cd5fd98.jpg)

> 然后，在一台机器上启动三个redis，一个作 master，两个作 slaver，
>
> master 端口：6380
>
> slaver1 端口：6381
>
> slaver2 端口：6382

![](https://img.imgdb.cn/item/6060353f8322e6675cdb36e2.jpg)

