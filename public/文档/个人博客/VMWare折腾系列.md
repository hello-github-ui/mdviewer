
Centos7 安装 NodeJS: https://www.cnblogs.com/zhi-leaf/p/10979629.html
Centos7 安装 Elasticsearch: https://blog.csdn.net/fjxcsdn/article/details/102002297
java: https://www.cnblogs.com/stulzq/p/9286878.html
vmware ip: https://blog.csdn.net/weixin_39829166/article/details/110476682
ssh 链接 虚拟机: https://blog.csdn.net/qq_40910138/article/details/105986831
elasticsearch-head 连接不上 elasticsearch，报CORS错误：https://blog.csdn.net/fst438060684/article/details/80936201
elasticsearch-head 的使用: https://www.cnblogs.com/xuwenjin/p/8792919.html


> linux 实在是坑太多了，稍不注意，一个点就够你忙活一两天了。而且查资料还基本得不到解决。

## NAT配置&&XShell连接

> 前提是，你的linux系统已经安装完毕（我这里以centos7举例说明，其它linux的发行版关于网络配置这一块都一模一样）

### vmware 配置

按照这个顺序配置

![](https://pic.imgdb.cn/item/61af730f2ab3f51d91b816a1.jpg)

> 解释一下：
> 一、在第6步中，设置的子网IP并不是你Linux真实的ip地址，它只是一个帮你把你的linux虚拟机挂载到你物理主机上的一个类似路由器的东东，所以它需要独立占用一个ip地址，而且这个ip地址我们一般设置为
> 以0结尾的地址，通常我喜欢设置为 `192.168.80.0`，子网掩码你就明白必须这样设置就行了。

![](https://pic.imgdb.cn/item/61af74c62ab3f51d91b8e99e.jpg)

> 到这里，关于vmware的设置就完了，之后不管出现什么问题，都与这里无关了。

记一下，你的网段是 `192.168.80.x` ，至于这个网段是否与你真实的物理机的网段是否相同无所谓，建议不相同(我的真实物理主机地址是192.168.168.168)，
到此为止，该网段已经占用了2个了，分别是虚拟路由器（即子网IP）占用了 `192.168.80.0`，虚拟网关占用了 `192.168.80.2`

### 物理机的虚拟网卡配置

打开方式：按下你的windows图标-》输入"控制面板"，回车-》选择网络和internet=》网络和共享中心-》更改适配器设置-》找到你的虚拟网卡（一般为VMnet8）右击打开属性-》找到TCP/IPv4，双击打开它-》

![](https://pic.imgdb.cn/item/61af777e2ab3f51d91ba3539.jpg)
> 【特别注意】：这里的IP地址，一定要设置成 `192.168.80.x` 网段 中除过 0，2 之外的任意地址（因为前面设置中已经占用了），我当时就是在这里卡了好久，linux中可以正常使用并上网，但就是xshell连接不上虚拟机，找了好久才发现这个问题。
> 到这里，关于虚拟网卡的设置也完了。

### Linux配置

关于网络这块只需要并且只能配置以下几个文件

#### /etc/sysconfig/network-scripts/ifcfg-ens33

先切换为 root 账号：
```vim /etc/sysconfig/network-scripts/ifcfg-ens33```

![](https://pic.imgdb.cn/item/61af7a032ab3f51d91bb6bac.jpg)

#### 设置DNS
```vim /etc/resolv.conf```

![](https://pic.imgdb.cn/item/61af7a812ab3f51d91bbb75e.jpg)

#### 主机名设置
```vim /etc/sysconfig/network```
![](https://pic.imgdb.cn/item/61af7ac72ab3f51d91bbe3c7.jpg)

```vim /etc/hostname```
![](https://pic.imgdb.cn/item/61af7b332ab3f51d91bc1af7.jpg)

### 重启网卡或者直接重启虚拟机
```service network restart```
之后你就可以使用xshell连接了。（如果不能，请考虑防火墙的问题以及22端口是否开启）

