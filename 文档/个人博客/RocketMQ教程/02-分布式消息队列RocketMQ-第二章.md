
# 分布式消息队列RocketMQ学习文档

> 本文资料来源：尚硅谷 | 本文发表时RocketMQ的版本：`v4.9.2` | 本资料是第二章内容，本文档总共有四章。
<hr/>

> 文章目录：
<ul>
<li><a target="_blank" href="https://hello-blogger-ui.blogspot.com/2021/10/rocketmq.html">分布式消息队列RocketMQ-学习文档-第一章</a></li>
<li><a target="_blank" href="https://hello-blogger-ui.blogspot.com/2021/10/rocketmq_29.html">分布式消息队列RocketMQ-学习文档-第二章</a></li>
<li><a target="_blank" href="https://hello-blogger-ui.blogspot.com/2021/10/rocketmq_62.html">分布式消息队列RocketMQ-学习文档-第三章</a></li>
<li><a target="_blank" href="https://hello-blogger-ui.blogspot.com/2021/10/rocketmq_32.html">分布式消息队列RocketMQ-学习文档-第四章</a></li>
</ul>



## 第2章 RocketMQ的安装与启动

### 一、基本概念

#### 1、消息（Message）

消息是指，消息系统所传输信息的物理载体，生产和消费数据的最小单位，每条消息必须属于一个主题。

#### 2、主题（Topic）

![](https://pic.imgdb.cn/item/617ac1bc2ab3f51d9143e847.jpg){width="5.575in" height="5.533333333333333in"}

Topic表示一类消息的集合，每个主题包含若干条消息，每条消息只能属于一个主题，是RocketMQ进行消息订阅的基本单位。 topic:message 1:n message:topic 1:1

一个生产者可以同时发送多种Topic的消息；而一个消费者只对某种特定的Topic感兴趣，即只可以订阅和消费一种Topic的消息。 producer:topic 1:n consumer:topic 1:1

#### 3、标签（Tag）

为消息设置的标签，用于同一主题下区分不同类型的消息。来自同一业务单元的消息，可以根据不同业务目的在同一主题下设置不同标签。标签能够有效地保持代码的清晰度和连贯性，并优化RocketMQ提供的查询系统。消费者可以根据Tag实现对不同子主题的不同消费逻辑，实现更好的扩展性。

Topic是消息的一级分类，Tag是消息的二级分类。

Topic：货物

tag=上海

tag=江苏

tag=浙江

------- 消费者 -----

topic=货物 tag = 上海

topic=货物 tag = 上海|浙江

topic=货物 tag = *

#### 4、队列（Queue）

存储消息的物理实体。一个Topic中可以包含多个Queue，每个Queue中存放的就是该Topic的消息。一个Topic的Queue也被称为一个Topic中消息的分区（Partition）。

一个Topic的Queue中的消息只能被一个消费者组中的一个消费者消费。一个Queue中的消息不允许同一个消费者组中的多个消费者同时消费。

![](https://pic.imgdb.cn/item/617ac0d12ab3f51d9142b47c.jpg){width="5.66875in" height="5.439583333333333in"}

在学习参考其它相关资料时，还会看到一个概念：分片（Sharding）。分片不同于分区。在RocketMQ中，分片指的是存放相应Topic的Broker。每个分片中会创建出相应数量的分区，即Queue，每个Queue的大小都是相同的。

![](https://pic.imgdb.cn/item/617ac05f2ab3f51d91421eaa.jpg){width="6.106944444444444in" height="4.23125in"}

#### 5、消息标识（MessageId/Key）

RocketMQ中每个消息拥有唯一的MessageId，且可以携带具有业务标识的Key，以方便对消息的查询。不过需要注意的是，MessageId有两个：在生产者send()消息时会自动生成一个MessageId（msgId)，当消息到达Broker后，Broker也会自动生成一个MessageId(offsetMsgId)。msgId、offsetMsgId与key都称为消息标识。

- msgId：由producer端生成，其生成规则为：
  <font color="#00CED1">producerIp + 进程pid + MessageClientIDSetter类的ClassLoader的hashCode + 当前时间 + AutomicInteger自增计数器</font>

- offsetMsgId：由broker端生成，其生成规则为：<font color="#00CED1">brokerIp + 物理分区的offset（Queue中的偏移量）</font>

- key：由用户指定的业务相关的唯一标识

>

### 二、系统架构

![](https://pic.imgdb.cn/item/617abd0a2ab3f51d913e04b7.jpg){width="6.106944444444444in" height="2.532638888888889in"}

RocketMQ架构上主要分为四部分构成：

#### 1、Producer

消息生产者，负责生产消息。Producer通过MQ的负载均衡模块选择相应的Broker集群队列进行消息投递，投递的过程支持快速失败并且低延迟。

> 例如，业务系统产生的日志写入到 的过程，就是消息生产的过程
>
> 再如，电商平台中用户提交的秒杀请求写入到 的过程，就是消息生产的过程

RocketMQ中的消息生产者都是以生产者组（Producer Group）的形式出现的。生产者组是同一类生产者的集合，这类Producer发送相同Topic类型的消息。一个生产者组可以同时发送多个主题的消息。

#### 2、Consumer

消息消费者，负责消费消息。一个消息消费者会从Broker服务器中获取到消息，并对消息进行相关业务处理。

> 例如，QoS 系统从 MQ 中读取日志，并对日志进行解析处理的过程就是消息消费的过程。
>
> 再如，电商平台的业务系统从 MQ 中读取到秒杀请求，并对请求进行处理的过程就是消息消费的过程。

RocketMQ中的消息消费者都是以消费者组（Consumer Group）的形式出现的。消费者组是同一类消费者的集合，这类Consumer消费的是同一个Topic类型的消息。消费者组使得在消息消费方面，实现<font color=" #00BFFF">负载均衡</font>（将一个Topic中的不同的Queue平均分配给同一个Consumer Group的不同的Consumer，注意，并不是将消息负载均衡）和<font color=" #00BFFF">容错</font>（一个Consmer挂了，该Consumer Group中的其它Consumer可以接着消费原Consumer消费的Queue）的目标变得非常容易。

![](https://pic.imgdb.cn/item/617ab2a42ab3f51d9130e7c9.jpg){width="6.106944444444444in" height="2.4381944444444446in"}

> 消费者组中Consumer的数量应该小于等于订阅Topic的Queue数量。如果超出Queue数量，则多出的Consumer将不能消费消息。

![](https://pic.imgdb.cn/item/617ab33b2ab3f51d913188b4.jpg){width="6.106944444444444in" height="2.9180555555555556in"}

不过，一个Topic类型的消息可以被多个消费者组同时消费。

> 注意，
>
> 1) 消费者组只能消费一个Topic的消息，不能同时消费多个Topic消息
> 2) 一个消费者组中的消费者必须订阅相同的Topic

#### 3、Name Server

##### ①、功能介绍

NameServer是一个Broker与Topic路由的注册中心，支持Broker的动态注册与发现。

 RocketMQ的思想来自于Kafka，而Kafka是依赖了Zookeeper的。所以，在RocketMQ的早期版本，即在 MetaQ v1.0与v2.0版本中，也是依赖于Zookeeper的。从MetaQ v3.0，即RocketMQ开始去掉了Zookeeper依赖，使用了自己的NameServer。

主要包括两个功能：

* <font color="#F00">Broker管理</font>：接受Broker集群的注册信息并且保存下来作为路由信息的基本数据；提供心跳检测机制，检查Broker是否还存活。

* <font color="#F00">路由信息管理</font>：每个NameServer中都保存着Broker集群的整个路由信息和用于客户端查询的队列信息。Producer和Conumser通过NameServer可以获取整个Broker集群的路由信息，从而进行消息的投递和消费。

##### ②、路由注册

NameServer通常也是以集群的方式部署，不过，NameServer是无状态的，即NameServer集群中的各个节点间是无差异的，各节点间相互不进行信息通讯。那各节点中的数据是如何进行数据同步的呢？在Broker节点启动时，轮询NameServer列表，与每个NameServer节点建立长连接，发起注册请求。在NameServer内部维护着一个Broker列表，用来动态存储Broker的信息。

> 注意，这是与其它像 `zk`、`Eureka`、`Nacos`等注册中心不同的地方。
> 这种 **NameServer** 的无状态方式，有什么优缺点：

> 优点：NameServer 集群搭建简单，扩容简单。

> 缺点：对于 Broker，必须明确指出所有 NameServer 地址。否则未指出的将> 不会去注册。也正因如此， NameServer并不能随便扩容。因为，若Broker不> 重新配置，新增的NameServer对于Broker来说是不可见的，其不会向这个NameServer进行注册。

Broker节点为了证明自己是活着的，为了维护与NameServer间的长连接，会将最新的信息以<font color="#00CED1">心跳包</font>的方式上报给NameServer，每30秒发送一次心跳。心跳包中包含 BrokerId、Broker地址(IP+Port)、Broker名称、Broker所属集群名称等等。NameServer在接收到心跳包后，会更新心跳时间戳，记录这个Broker的最新存活时间。

##### ③、路由剔除

由于Broker关机、宕机或网络抖动等原因，NameServer没有收到Broker的心跳，NameServer可能会将其从Broker列表中剔除。

NameServer中有一个定时任务，每隔10秒就会扫描一次Broker表，查看每一个Broker的最新心跳时间戳距离当前时间是否超过120秒，如果超过，则会判定Broker失效，然后将其从Broker列表中剔除。

> 扩展：对于RocketMQ日常运维工作，例如Broker升级，需要停掉Broker的工作，OP需要怎么做？
> OP需要将Broker的读写权限禁掉。一旦Client（Consumer或Producer）向broker发送请求，都会收到broker的<font color="#00CED1">NO_PERMISSION</font>响应，然后client会进行对其它Broker的重试。
> 当OP观察到这个Broker没有流量后，再关闭它，实现Broker从NameServer的移除。
> OP：运维工程师
> SRE：Site Reliability Engineer，现场可靠性工程师。


##### ④、路由发现

RocketMQ的路由发现采用的是Pull模型。当Topic路由信息出现变化时，NameServer不会主动推送给客户端，而是客户端定时拉取主题最新的路由。默认客户端每30秒会拉取一次最新的路由。

> 扩展：
>
> 1) <font color="#FF6A6A">Push模型</font>：推送模型。其实时性较好，是一个 "发布-订阅" 模型，需要维护一个长连接。而长连接的维护是需要资源成本的。该模型适合于的场景：
>
> - 实时性要求较高
> - Client数量不多， Server数据变化较频繁
>
> 2) <font color="#FF6A6A">Pull模型</font>：拉取模型。存在的问题是，实时性较差。
> 3) <font color="#FF6A6A">Long Polling模型</font>：长轮询模型。其是对 `Push` 与 `Pull` 模型的整合，充分利用了这两种模型的优势，屏蔽了它们的劣势。

##### ⑤、客户端NameServer选择策略

> 这里的客户端指的是 Producer 与 Consumer

客户端在配置时必须要写上NameServer集群的地址，那么客户端到底连接的是哪个NameServer节点呢？客户端首先会生产一个随机数，然后再与NameServer节点数量取模，此时得到的就是所要连接的节点索引，然后就会进行连接。如果连接失败，则会采用round-robin策略，逐个尝试着去连接其它节点。

首先采用的是<font color="#FF00FF">随机策略</font>进行的选择，失败后采用的是<font color="#FF00FF">轮询策略</font>。

> 扩展：Zookeeper Client是如何选择 Zookeeper Server的？
> 简单来说就是，经过两次 shuffle，然后选择第一台 Zookeeper Server。
> 详细说就是，将配置文件中的 zk server地址进行第一次 shuffle，然后随机选择一个。这个选择出的一般都是一个hostname。然后获取到该 hostname对应的所有ip，再对这些ip进行第二次shuffle，从shuffle过的结果中取第一个server地址进行连接。

#### 4 Broker

##### ①、功能介绍

Broker充当着消息中转角色，负责存储消息、转发消息。Broker在RocketMQ系统中负责接收并存储从生产者发送来的消息，同时为消费者的拉取请求作准备。Broker同时也存储着消息相关的元数据，包括消费者组消费进度偏移offset、主题、队列等。

> ***Kafka 0.8***版本之后， ***offset***是存放在 ***Broker*** 中的，之前版本是存放在 ***Zookeeper*** 中的。

##### ②、模块构成

下图为Broker Server的功能模块示意图。

![](https://pic.imgdb.cn/item/617abc0d2ab3f51d913d08e1.jpg){width="6.106944444444444in" height="3.563888888888889in"}

<font color="#FF0000">Remoting Module</font>：整个Broker的实体，负责处理来自clients端的请求。而这个Broker实体则由以下模块构成。

<font color="#FF0000">Client Manager</font>：客户端管理器。负责接收、解析客户端(Producer/Consumer)请求，管理客户端。例如，维护Consumer的Topic订阅信息

<font color="#FF0000">Store Service</font>：存储服务。提供方便简单的API接口，处理<font color="#1E90FF">消息存储到物理硬盘</font>和<font color="#1E90FF">消息查询</font>功能。

<font color="#FF0000">HA Service</font>：高可用服务，提供Master Broker 和 Slave Broker之间的数据同步功能。

<font color="#FF0000">Index Service</font>：索引服务。根据特定的Message key，对投递到Broker的消息进行索引服务，同时也提供根据Message Key对消息进行快速查询的功能。

##### ③、集群部署

![](https://pic.imgdb.cn/item/617abd0a2ab3f51d913e04b7.jpg){width="6.106944444444444in" height="2.532638888888889in"}

为了增强Broker性能与吞吐量，Broker一般都是以集群形式出现的。各集群节点中可能存放着相同Topic的不同Queue。不过，这里有个问题，如果某Broker节点宕机，如何保证数据不丢失呢？其解决方案是，将每个Broker集群节点进行横向扩展，即将Broker节点再建为一个HA集群，解决单点问题。

Broker节点集群是一个主从集群，即集群中具有Master与Slave两种角色。Master负责处理读写操作请求，Slave负责对Master中的数据进行备份。当Master挂掉了，Slave则会自动切换为Master去工作。所以这个Broker集群是主备集群。一个Master可以包含多个Slave，但一个Slave只能隶属于一个Master。Master与Slave 的对应关系是通过指定相同的BrokerName、不同的BrokerId 来确定的。BrokerId为0表示Master，非0表示Slave。每个Broker与NameServer集群中的所有节点建立长连接，定时注册Topic信息到所有NameServer。

#### 5 工作流程

##### ①、具体流程

1）启动NameServer，NameServer启动后开始监听端口，等待Broker、Producer、Consumer连接。

2）启动Broker时，Broker会与所有的NameServer建立并保持长连接，然后每30秒向NameServer定时发送心跳包。

3）发送消息前，可以先创建Topic，创建Topic时需要指定该Topic要存储在哪些Broker上，当然，在创建Topic时也会将Topic与Broker的关系写入到NameServer中。不过，这步是可选的，也可以在发送消息时自动创建Topic。

4）Producer发送消息，启动时先跟NameServer集群中的其中一台建立长连接，并从NameServer中获取路由信息，即当前发送的Topic消息的Queue与Broker的地址（IP+Port）的映射关系。然后根据算法策略从队选择一个Queue，与队列所在的Broker建立长连接从而向Broker发消息。当然，在获取到路由信息后，Producer会首先将路由信息缓存到本地，再每30秒从NameServer更新一次路由信息。

5）Consumer跟Producer类似，跟其中一台NameServer建立长连接，获取其所订阅Topic的路由信息，然后根据算法策略从路由信息中获取到其所要消费的Queue，然后直接跟Broker建立长连接，开始消费其中的消息。Consumer在获取到路由信息后，同样也会每30秒从NameServer更新一次路由信息。不过不同于Producer的是，Consumer还会向Broker发送心跳，以确保Broker的存活状态。

##### ②、Topic

手动创建Topic时，有两种模式：

* 集群模式：该模式下创建的Topic在该集群中，所有Broker中的Queue数量是相同的。
* Broker模式：该模式下创建的Topic在该集群中，每个Broker中的Queue数量可以不同。

<font color="#FFF68F">自动创建Topic时，默认采用的是Broker模式，会为每个Broker默认创建4个Queue。</font>

##### ③、读/写队列

从物理上来讲，读/写队列是同一个队列。所以，不存在读/写队列数据同步问题。读/写队列是逻辑上进行区分的概念。一般情况下，读/写队列数量是相同的。

> 例如，创建Topic时设置的写队列数量为8，读队列数量为4，此时系统会创建8个Queue，分别是0 1 2 3 4 5 6 7。Producer会将消息写入到这8个队列，但Consumer只会消费0 1 2 3这4个队列中的消息，4 5 6 7中的消息是不会被消费到的。

> 再如，创建Topic时设置的写队列数量为4，读队列数量为8，此时系统会创建8个Queue，分别是0 1 2 3 4 5 6 7。Producer会将消息写入到0 1 2 3 这4个队列，但Consumer只会消费0 1 2 3 4 5 6 7这8个队列中的消息，但是4 5 6 7中是没有消息的。此时假设Consumer Group中包含两个Consuer，Consumer1消费0 1 2 3，而Consumer2消费4 5 6 7。但实际情况是，Consumer2是没有消息可消费的。

> 也就是说，当读/写队列数量设置不同时，总是有问题的。那么，为什么要这样设计呢？
>
> 其这样设计的目的是为了，方便Topic的Queue的缩容。
>
> 例如，原来创建的Topic中包含16个Queue，如何能够使其Queue缩容为8个，还不会丢失消息？可以动态修改写队列数量为8，读队列数量不变。此时新的消息只能写入到前8个队列，而消费都消费的却是16个队列中的数据。当发现后8个Queue中的消息消费完毕后，就可以再将读队列数量动态设置为8。整个缩容过程，没有丢失任何消息。
>
> perm用于设置对当前创建Topic的操作权限：2表示只写，4表示只读，6表示读写。


### 三、单机安装与启动

#### 1、准备工作

##### ①、软硬件需求

系统要求是64位的，JDK要求是1.8及其以上版本的。

![](https://pic.imgdb.cn/item/617ac5fd2ab3f51d91498a27.jpg){width="6.106944444444444in" height="3.6055555555555556in"}

##### ②、下载RocketMQ安装包

![](https://pic.imgdb.cn/item/617ac6332ab3f51d9149cdee.jpg){width="6.106944444444444in" height="6.096527777777778in"}

将下载的安装包上传到Linux。***一般我将软件上传到`/opt/tools`下，解压缩后放到 `/opt/apps`下***

![](https://pic.imgdb.cn/item/617ac65c2ab3f51d914a08f9.jpg){width="6.106944444444444in" height="0.8229166666666666in"}

解压：`unzip rocketmq-all-4.8.0-bin-release.zip -D /opt/apps`

![](https://pic.imgdb.cn/item/617ac66e2ab3f51d914a213e.jpg){width="6.106944444444444in" height="2.1881944444444446in"}

#### 2、修改初始内存

##### ①、修改runserver.sh

使用vim命令打开bin/runserver.sh文件。现将这些值修改为如下：

![](https://pic.imgdb.cn/item/617ac7902ab3f51d914ba23c.jpg){width="6.106944444444444in" height="1.823611111111111in"}

##### ②、修改runbroker.sh

使用vim命令打开bin/runbroker.sh文件。现将这些值修改为如下：

![](https://pic.imgdb.cn/item/617ac7aa2ab3f51d914bc3a6.jpg){width="6.106944444444444in" height="1.167361111111111in"}

#### 3、启动

##### ①、启动NameServer

```shell
nohup sh bin/mqnamesrv &
tail -f \~/logs/rocketmqlogs/namesrv.log
```

![](https://pic.imgdb.cn/item/617ac8e92ab3f51d914d9951.jpg){width="6.106944444444444in" height="2.0527777777777776in"}

##### ②、启动broker

```shell
nohup sh bin/mqbroker -n localhost:9876 &
tail -f ~/logs/rocketmqlogs/broker.log
```

![](https://pic.imgdb.cn/item/617aca672ab3f51d914fc144.jpg){width="6.106944444444444in" height="1.792361111111111in"}

#### 4、发送/接收消息测试

##### ①、发送消息

```shell
export NAMESRV_ADDR=localhost:9876
sh bin/tools.sh org.apache.rocketmq.example.quickstart.Producer
```


##### ②、接收消息

```shell
sh bin/tools.sh org.apache.rocketmq.example.quickstart.Consumer
```


#### 5、关闭Server

无论是关闭name server还是broker，都是使用bin/mqshutdown命令。

![](https://pic.imgdb.cn/item/617acbca2ab3f51d91515d86.jpg){width="5.022916666666666in" height="1.667361111111111in"}

### 四、 控制台的安装与启动

RocketMQ有一个可视化的dashboard，通过该控制台可以直观的查看到很多数据。

#### 1、下载

下载地址：<https://github.com/apache/rocketmq-externals/releases>

![](https://pic.imgdb.cn/item/617accff2ab3f51d9152eb17.jpg){width="6.106944444444444in" height="6.492361111111111in"}

#### 2、修改配置

修改其src/main/resources中的application.properties配置文件。

* 原来的端口号为8080，修改为一个不常用的，比如7000
* 指定RocketMQ的name server地址

<del>其实我不太推荐在配置文件中写死`rocketmq.config.namesrvAddr=192.168.80.6:9876`，更喜欢这里写为null，然后通过`jar -jar rocketmq-console-ng-1.0.0.jar --rocketmq.config.namesrvAddr=192.168.80.6:9876`这种方式，因为其很灵活，不需要每次修改配置文件后再重新打包</del>

![](https://pic.imgdb.cn/item/617acd902ab3f51d9153d65c.jpg){width="5.585416666666666in" height="3.657638888888889in"}

#### 3、添加依赖

在解压目录rocketmq-console的pom.xml中添加如下JAXB依赖。

> JAXB，Java Architechture for Xml Binding，用于XML绑定的Java技术，是一个业界标准，是一项可以根据XML Schema生成Java类的技术。

```xml
<!-- JAXB 可以根据XML Scheme 生成 Java 类的依赖-->
        <dependency>
            <groupId>javax.xml.bind</groupId>
            <artifactId>jaxb-api</artifactId>
            <version>2.3.0</version>
        </dependency>
        <dependency>
            <groupId>com.sun.xml.bind</groupId>
            <artifactId>jaxb-impl</artifactId>
            <version>2.3.0</version>
        </dependency>
        <dependency>
            <groupId>com.sun.xml.bind</groupId>
            <artifactId>jaxb-core</artifactId>
            <version>2.3.0</version>
        </dependency>
        <dependency>
            <groupId>javax.activation</groupId>
            <artifactId>activation</artifactId>
            <version>1.1.1</version>
        </dependency>
```

#### 4、打包

在rocketmq-console目录下打开CMD（注意切记不要使用PowerShell），运行maven的打包命令。
`mvn clean package -Dmaven.test.skip=true`

#### 5、启动

`java -jar rocketmq-console-ng-1.0.0.jar`

#### 6、访问

![](https://pic.imgdb.cn/item/617ad13d2ab3f51d9158cf11.jpg){width="6.106944444444444in" height="5.16875in"}

> 注意：如果此处访问失败，获取不到Topic信息，则很大可能是由于你连接目标mq服务器所在的Linux服务器开启了防火墙导致的，只需要关闭即可。（不确定是这个问题时，可以采取将该console jar 包也上传到服务器上，然后修改namesrvAddr=local host:9876后再访问即可尝试）

### 五、集群搭建理论

![](https://pic.imgdb.cn/item/617ad2392ab3f51d9159d87e.jpg){width="6.106944444444444in" height="3.657638888888889in"}

#### 1、数据复制与刷盘策略

![](https://pic.imgdb.cn/item/617ad5972ab3f51d915db503.jpg){width="5.54375in" height="4.554166666666666in"}

##### ①、复制策略

复制策略是Broker的Master与Slave间的数据同步方式。分为同步复制与异步复制：

* 同步复制：消息写入master后，master会等待slave同步数据成功后才向producer返回成功ACK
* 异步复制：消息写入master后，master立即向producer返回成功ACK，无需等待slave同步数据成功

> 异步复制策略会降低系统的写入延迟， 变小，提高了系统的吞吐量

##### ②、刷盘策略

刷盘策略指的是broker中消息的落盘方式，即消息发送到broker内存后消息持久化到磁盘的方式。分为同步刷盘与异步刷盘：

* 同步刷盘：当消息持久化到broker的磁盘后才算是消息写入成功。
* 异步刷盘：当消息写入到broker的内存后即表示消息写入成功，无需等待消息持久化到磁盘。

> 1）异步刷盘策略会降低系统的写入延迟，RT变小，提高了系统的吞吐量
> 2）消息写入到Broker的内存，一般是写入到了PageCache
> 3）对于异步 刷盘策略，消息会写入到PageCache后立即返回成功ACK。但并不会立即做落盘操作，而是当PageCache到达一定量时会自动进行落盘。

#### 2、Broker集群模式

根据Broker集群中各个节点间关系的不同，Broker集群可以分为以下几类：

##### ①、单Master

只有一个broker（其本质上就不能称为集群）。这种方式也只能是在测试时使用，生产环境下不能使用，因为存在单点问题。

##### ②、多Master

broker集群仅由多个master构成，不存在Slave。同一Topic的各个Queue会平均分布在各个master节点上。

* 优点：配置简单，单个Master宕机或重启维护对应用无影响，在磁盘配置为RAID10时，即使机器宕机不可恢复情况下，由于RAID10磁盘非常可靠，消息也不会丢（异步刷盘丢失少量消息，同步刷盘一条不丢），性能最高；
* 缺点：单台机器宕机期间，这台机器上未被消费的消息在机器恢复之前不可订阅（不可消费），消息实时性会受到影响。

> 以上优点的前提是，这些Master都配置了RAID磁盘阵列。如果没有配置，一旦出现某Master宕机，则会发生大量消息丢失的情况。

##### ③、多Master多Slave模式-异步复制

broker集群由多个master构成，每个master又配置了多个slave（在配置了RAID磁盘阵列的情况下，一个master一般配置一个slave即可）。master与slave的关系是主备关系，即master负责处理消息的读写请求，而slave仅负责消息的备份与master宕机后的角色切换。

异步复制即前面所讲的<font color="#00FFFF">复制策略</font>中的<font color="#00CED1">异步复制策略</font>，即消息写入master成功后，master立即向producer返回成功ACK，无需等待slave同步数据成功。

该模式的最大特点之一是，当master宕机后slave能够<font color="#00FFFF">自动切换</font>为master。不过由于slave从master的同步具有短暂的延迟（毫秒级），所以当master宕机后，这种异步复制方式可能会存在少量消息的丢失问题。

> Slave从Master同步的延迟越短，其可能丢失的消息就越少
> 对于Master的RAID磁盘阵列，若使用的也是异步复制策略，同样也存在延迟问题，同样也可能会丢失消息。但RAID阵列的秘诀是微秒级的（因为是由硬盘支持的），所以其丢失的数据量会更少。

##### ④、多Master多Slave模式-同步双写

该模式是多<font color="#00FFFF">Master多Slave模式</font>的<font color="#FF0000">同步复制</font>实现。所谓<font color="#00FFFF">同步双写</font>，指的是消息写入master成功后，master会等待slave同步数据成功后才向producer返回成功ACK，即master与slave都要写入成功后才会返回成功ACK，也即<font color="#FF0000">双写</font>。

该模式与<font color="#00FFFF">异步复制模式</font>相比，优点是消息的安全性更高，不存在消息丢失的情况。但单个消息的RT略高，从而导致性能要略低（大约低10%）。

> 该模式存在一个大的问题：对于目前的版本，Master宕机后，Slave 不会自动切换到Master。

##### ⑤、最佳实践

一般会为Master配置RAID10磁盘阵列，然后再为其配置一个Slave。即利用了RAID10磁盘阵列的高效、安全性，又解决了可能会影响订阅的问题。

> 1）RAID磁盘阵列的效率要高于Master-Slave集群。因为RAID是硬件支持的。也正因为如此，所以RAID阵列的搭建成本较高。
> 2）多Master+RAID阵列，与多Master多Slave集群的区别是什么？
>
> > * 多Master+RAID阵列，其仅仅可以保证数据不丢失，即不影响消息写入，但其可能会影响到消息的订阅。但其执行效率要远高于<font color="#00FFFF">多Master多Slave集群</font>
> > * 多Master多Slave集群，其不仅可以保证数据不丢失，也不会影响消息写入。其运行效率要低于<font color="#00FFFF">多Master+RAID阵列</font>


### 六、磁盘阵列RAID（补充）

#### 1、RAID历史

1988 年美国加州大学伯克利分校的 D. A. Patterson 教授等首次在论文 "A Case of Redundant Array of Inexpensive Disks" 中提出了 RAID 概念 ，即<font color="#00FFFF">廉价冗余磁盘阵列</font>（ Redundant Array of Inexpensive Disks ）。由于当时大容量磁盘比较昂贵， RAID 的基本思想是将多个容量较小、相对廉价的磁盘进行有机组合，从而以较低的成本获得与昂贵大容量磁盘相当的容量、性能、可靠性。随着磁盘成本和价格的不断降低， "廉价" 已经毫无意义。因此， RAID 咨询委员会（ RAID Advisory Board, RAB ）决定用" 独立 " 替代 " 廉价 " ，于时 RAID 变成了<font color="#00FFFF">独立磁盘冗余阵列</font>（ Redundant Array of Independent Disks ）。但这仅仅是名称的变化，实质内容没有改变。

> 内存：32m 6.4G （IBM 10.1G）

#### 2、RAID等级

RAID 这种设计思想很快被业界接纳， RAID 技术作为高性能、高可靠的存储技术，得到了非常广泛的应用。 RAID 主要利用镜像、数据条带和数据校验三种技术来获取高性能、可靠性、容错能力和扩展性，根据对这三种技术的使用策略和组合架构，可以把 RAID 分为不同的等级，以满足不同数据应用的需求。

D.A.Patterson 等的论文中定义了 RAID0 \~ RAID6 原始 RAID 等级。随后存储厂商又不断推出 RAID7、RAID10、RAID01 、 RAID50 、 RAID53 、 RAID100 等 RAID 等级，但这些并无统一的标准。目前业界与学术界公认的标准是 RAID0 \~ RAID6 ，而在实际应用领域中使用最多的 RAID 等级是 RAID0 、 RAID1 、 RAID3 、 RAID5 、 RAID6 和 RAID10。

RAID 每一个等级代表一种实现方法和技术，等级之间并无高低之分。在实际应用中，应当根据用户的数据应用特点，综合考虑可用性、性能和成本来选择合适的 RAID 等级，以及具体的实现方式。

#### 3关键技术

##### ①、镜像技术

镜像技术是一种冗余技术，为磁盘提供数据备份功能，防止磁盘发生故障而造成数据丢失。对于 RAID 而言，采用镜像技术最典型地的用法就是，同时在磁盘阵列中产生两个完全相同的数据副本，并且分布在两个不同的磁盘上。镜像提供了完全的数据冗余能力，当一个数据副本失效不可用时，外部系统仍可正常访问另一副本，不会对应用系统运行和性能产生影响。而且，镜像不需要额外的计算和校验，故障修复非常快，直接复制即可。镜像技术可以从多个副本进行并发读取数据，提供更高的读 I/O 性能，但不能并行写数据，写多个副本通常会导致一定的 I/O 性能下降。

镜像技术提供了非常高的数据安全性，其代价也是非常昂贵的，需要至少双倍的存储空间。高成本限制了镜像的广泛应用，主要应用于至关重要的数据保护，这种场合下的数据丢失可能会造成非常巨大的损失。

##### ②、数据条带技术

数据条带化技术是一种自动将 I/O操作负载均衡到多个物理磁盘上的技术。更具体地说就是，将一块连续的数据分成很多小部分并把它们分别存储到不同磁盘上。这就能使多个进程可以并发访问数据的多个不同部分，从而获得最大程度上的 I/O 并行能力，极大地提升性能。

##### ③、数据校验技术

数据校验技术是指， RAID 要在写入数据的同时进行校验计算，并将得到的校验数据存储在 RAID 成员磁盘中。校验数据可以集中保存在某个磁盘或分散存储在多个不同磁盘中。当其中一部分数据出错时，就可以对剩余数据和校验数据进行反校验计算重建丢失的数据。

数据校验技术相对于镜像技术的优势在于节省大量开销，但由于每次数据读写都要进行大量的校验运算，对计算机的运算速度要求很高，且必须使用硬件 RAID 控制器。在数据重建恢复方面，检验技术比镜像技术复杂得多且慢得多。

#### 4、RAID分类

从实现角度看， RAID 主要分为软 RAID、硬 RAID 以及混合 RAID 三种。

##### ①、软 RAID

所有功能均有操作系统和 CPU 来完成，没有独立的 RAID 控制处理芯片和 I/O 处理芯片，效率自然最低。

##### ②、硬 RAID

配备了专门的 RAID 控制处理芯片和 I/O 处理芯片以及阵列缓冲，不占用 CPU 资源。效率很高，但成本也很高。

##### ③、混合 RAID

具备 RAID 控制处理芯片，但没有专门的I/O 处理芯片，需要 CPU 和驱动程序来完成。性能和成本在软 RAID 和硬 RAID 之间。

####  5、常见RAID等级详解

##### ①、JBOD

![](https://pic.imgdb.cn/item/617ada1f2ab3f51d9162301e.jpg){width="2.6055555555555556in" height="2.3652777777777776in"}

JBOD ，Just a Bunch of Disks，磁盘簇。表示一个没有控制软件提供协调控制的磁盘集合，这是 RAID 区别与 JBOD 的主要因素。 JBOD 将多个物理磁盘串联起来，提供一个巨大的逻辑磁盘。

JBOD 的数据存放机制是由第一块磁盘开始按顺序往后存储，当前磁盘存储空间用完后，再依次往后面的磁盘存储数据。 JBOD 存储性能完全等同于单块磁盘，而且也不提供数据安全保护。

> 其只是简单提供一种扩展存储空间的机制， 可用存储容量等于所有成员磁盘的存储空间之和

JBOD 常指磁盘柜，而不论其是否提供 RAID 功能。不过，JBOD并非官方术语，官方称为Spanning。

##### ②、RAID0

![](https://pic.imgdb.cn/item/617ada8a2ab3f51d91628bc8.jpg){width="1.5631944444444446in" height="2.4069444444444446in"}

RAID0 是一种简单的、无数据校验的<font color="#00CED1">数据条带化技术</font>。实际上不是一种真正的 RAID ，因为它并不供任何形式的冗余策略。 RAID0 将所在磁盘条带化后组成大容量的存储空间，将数据分散存储在所有磁盘中，以独立访问方式实现多块磁盘的并读访问。

理论上讲，一个由 n 块磁盘组成的 RAID0 ，它的读写性能是单个磁盘性能的 n 倍，但由于总线带宽等多种因素的限制，实际的性能提升低于理论值。由于可以并发执行 I/O 操作，总线带宽得到充分利用。再加上不需要进行数据校验，<font color="#00CED1">RAID0 的性能在所有 RAID 等级中是最高的</font>。

RAID0 具有低成本、高读写性能、 100% 的高存储空间利用率等优点，但是它不提供数据冗余保护，一旦数据损坏，将无法恢复。

应用场景：对数据的顺序读写要求不高，对数据的安全性和可靠性要求不高，但对系统性能要求很高的场景。

> RAID0与JBOD相同点：
> 1）存储容量：都是成员磁盘容量总和
> 2）磁盘利用率，都是100%，即都没有做任何的数据冗余备份
> RAID0与JBOD不同点：
> JBOD：数据是顺序存放的，一个磁盘存满后才会开始存放到下一个磁盘
> RAID：各个磁盘中的数据写入是并行的，是通过数据条带技术写入的。其读写性能是JBOD的n倍

##### ③、RAID1

![](https://pic.imgdb.cn/item/617adbe12ab3f51d9163d7f4.jpg){width="1.5631944444444446in" height="2.4069444444444446in"}

RAID1 就是一种<font color="#00CED1">镜像技术</font>，它将数据完全一致地分别写到工作磁盘和镜像磁盘，它的磁盘空间利用率为 50% 。 RAID1 在数据写入时，响应时间会有所影响，但是读数据的时候没有影响。 RAID1 提供了最佳的数据保护，一旦工作磁盘发生故障，系统将自动切换到镜像磁盘，不会影响使用。

RAID1是为了增强数据安全性使两块磁盘数据呈现完全镜像，从而达到安全性好、技术简单、管理方便。 RAID1 拥有完全容错的能力，但实现成本高。

应用场景：对顺序读写性能要求较高，或对数据安全性要求较高的场景。

##### ④、RAID10

![](https://pic.imgdb.cn/item/617adc622ab3f51d91644fe0.jpg){width="3.365972222222222in" height="3.553472222222222in"}

RAID10是一个RAID1与RAID0的组合体，所以它继承了RAID0的快速和RAID1的安全。

简单来说就是，先做<font color="#00CED1">条带</font>，再做<font color="#00CED1">镜像</font>。发即将进来的数据先分散到不同的磁盘，再将磁盘中的数据做镜像。

##### ⑤、RAID01

![](https://pic.imgdb.cn/item/617adca22ab3f51d916484c0.jpg){width="3.365972222222222in" height="3.6055555555555556in"}

RAID01是一个RAID0与RAID1的组合体，所以它继承了RAID0的快速和RAID1的安全。

简单来说就是，先做<font color="#00CED1">镜像</font>再做<font color="#00CED1">条带</font>。即将进来的数据先做镜像，再将镜像数据写入到与之前数据不同的磁盘，即再做条带。

> RAID10要比RAID01的容错率再高，所以生产环境下一般是不使用RAID01的。

### 七、集群搭建实践

#### 1、集群架构

这里要搭建一个双主双从异步复制的Broker集群。为了方便，这里使用了两台主机来完成集群的搭建。

这两台主机的功能与broker角色分配如下表。

| 序号 | 主机名/IP   | IP             | 功能                | BROKER角色       |
| ---- | ----------- | -------------- | ------------------- | ---------------- |
| 1    | rocketmqOS1 | 192.168.59.164 | NameServer + Broker | Master1 + Slave2 |
| 2    | rocketmqOS2 | 192.168.59.165 | NameServer + Broker | Master2 + Slave1 |
|      |             |                |                     |                  |


#### 2、克隆生成rocketmqOS1

克隆rocketmqOS主机，并修改配置。指定主机名为rocketmqOS1。
`vi /etc/hostname`

#### 3、修改rocketmqOS1配置文件

##### ①、配置文件位置

要修改的配置文件在rocketMQ解压目录的conf/2m-2s-async目录中。

![](https://pic.imgdb.cn/item/617ade602ab3f51d9166549a.jpg){width="6.106944444444444in" height="1.3652777777777778in"}

##### ②、修改broker-a.properties

将该配置文件内容修改为如下：

```properties
# 指定整个broker集群的名称，或者说是RocketMQ集群的名称
brokerClusterName=DefaultCluster
# 指定master-slave集群的名称。一个RocketMQ集群可以包含多个master-slave集群
brokerName=broker-a
# master的brokerId为0
brokerId=0
# 指定删除消息存储过期文件的时间为凌晨4点
deleteWhen=04
# 指定未发生更新的消息存储文件的保留时长为48小时，48小时后过期，将会被删除
fileReservedTime=48
# 指定当前broker为异步复制master
brokerRole=ASYNC_MASTER
# 指定刷盘策略为异步刷盘
flushDiskType=ASYNC_FLUSH
# 指定Name Server的地址
namesrvAddr=192.168.59.164:9876;192.168.59.165:9876
```

##### ③、修改broker-b-s.properties

```properties
brokerClusterName=DefaultCluster
# 指定这是另外一个master-slave集群
brokerName=broker-b
# slave的brokerId为非0
brokerId=1
deleteWhen=04
fileReservedTime=48
# 指定当前broker为slave
brokerRole=SLAVE
flushDiskType=ASYNC_FLUSH
namesrvAddr=192.168.59.164:9876;192.168.59.165:9876
# 指定Broker对外提供服务的端口，即Broker与producer与consumer通信的端口。默认
10911。由于当前主机同时充当着master1与slave2，而前面的master1使用的是默认端口。这
里需要将这两个端口加以区分，以区分出master1与slave2
listenPort=11911
# 指定消息存储相关的路径。默认路径为~/store目录。由于当前主机同时充当着master1与
slave2，master1使用的是默认路径，这里就需要再指定一个不同路径
storePathRootDir=~/store-s
storePathCommitLog=~/store-s/commitlog
storePathConsumeQueue=~/store-s/consumequeue
storePathIndex=~/store-s/index
storeCheckpoint=~/store-s/checkpoint
abortFile=~/store-s/abort
```

##### ④、其它配置

除了以上配置外，这些配置文件中还可以设置其它属性。

```properties
#指定整个broker集群的名称，或者说是RocketMQ集群的名称
brokerClusterName=rocket-MS
#指定master-slave集群的名称。一个RocketMQ集群可以包含多个master-slave集群
brokerName=broker-a
#0 表示 Master，>0 表示 Slave
brokerId=0
#nameServer地址，分号分割
namesrvAddr=nameserver1:9876;nameserver2:9876
#默认为新建Topic所创建的队列数
defaultTopicQueueNums=4
#是否允许 Broker 自动创建Topic，建议生产环境中关闭
autoCreateTopicEnable=true
#是否允许 Broker 自动创建订阅组，建议生产环境中关闭
autoCreateSubscriptionGroup=true
#Broker对外提供服务的端口，即Broker与producer与consumer通信的端口
listenPort=10911
#HA高可用监听端口，即Master与Slave间通信的端口，默认值为listenPort+1
haListenPort=10912
#指定删除消息存储过期文件的时间为凌晨4点
deleteWhen=04
#指定未发生更新的消息存储文件的保留时长为48小时，48小时后过期，将会被删除
fileReservedTime=48
#指定commitLog目录中每个文件的大小，默认1G
mapedFileSizeCommitLog=1073741824
#指定ConsumeQueue的每个Topic的每个Queue文件中可以存放的消息数量，默认30w条
mapedFileSizeConsumeQueue=300000
#在清除过期文件时，如果该文件被其他线程所占用（引用数大于0，比如读取消息），此时会阻止
此次删除任务，同时在第一次试图删除该文件时记录当前时间戳。该属性则表示从第一次拒绝删除
后开始计时，该文件最多可以保留的时长。在此时间内若引用数仍不为0，则删除仍会被拒绝。不过
时间到后，文件将被强制删除
destroyMapedFileIntervalForcibly=120000
#指定commitlog、consumequeue所在磁盘分区的最大使用率，超过该值，则需立即清除过期文
件
diskMaxUsedSpaceRatio=88
#指定store目录的路径，默认在当前用户主目录中
storePathRootDir=/usr/local/rocketmq-all-4.5.0/store
#commitLog目录路径
storePathCommitLog=/usr/local/rocketmq-all-4.5.0/store/commitlog
#consumeueue目录路径
storePathConsumeQueue=/usr/local/rocketmq-all-4.5.0/store/consumequeue
#index目录路径
storePathIndex=/usr/local/rocketmq-all-4.5.0/store/index
#checkpoint文件路径
storeCheckpoint=/usr/local/rocketmq-all-4.5.0/store/checkpoint
#abort文件路径
abortFile=/usr/local/rocketmq-all-4.5.0/store/abort
#指定消息的最大大小
maxMessageSize=65536
#Broker的角色
# - ASYNC_MASTER 异步复制Master
# - SYNC_MASTER 同步双写Master
# - SLAVE
brokerRole=SYNC_MASTER
#刷盘策略
# - ASYNC_FLUSH 异步刷盘
# - SYNC_FLUSH 同步刷盘
flushDiskType=SYNC_FLUSH
#发消息线程池数量
sendMessageThreadPoolNums=128
#拉消息线程池数量
pullMessageThreadPoolNums=128
#强制指定本机IP，需要根据每台机器进行修改。官方介绍可为空，系统默认自动识别，但多网卡
时IP地址可能读取错误
brokerIP1=192.168.3.105
```

#### 4、克隆生成rocketmqOS2

克隆rocketmqOS1主机，并修改配置。指定主机名为rocketmqOS2。

#### 5、修改rocketmqOS2配置文件

对于rocketmqOS2主机，同样需要修改rocketMQ解压目录的conf目录的子目录2m-2s-async中的两个配置文件。

##### ①、修改broker-b.properties

将该配置文件内容修改为如下：

```properties
brokerClusterName=DefaultCluster
brokerName=broker-b
brokerId=0
deleteWhen=04
fileReservedTime=48
brokerRole=ASYNC_MASTER
flushDiskType=ASYNC_FLUSH
namesrvAddr=192.168.59.164:9876;192.168.59.165:9876
```

##### ②、修改broker-a-s.properties

将该配置文件内容修改为如下：

```properties
brokerClusterName=DefaultCluster
brokerName=broker-a
brokerId=1
deleteWhen=04
fileReservedTime=48
brokerRole=SLAVE
flushDiskType=ASYNC_FLUSH
namesrvAddr=192.168.59.164:9876;192.168.59.165:9876
listenPort=11911
storePathRootDir=~/store-s
storePathCommitLog=~/store-s/commitlog
storePathConsumeQueue=~/store-s/consumequeue
storePathIndex=~/store-s/index
storeCheckpoint=~/store-s/checkpoint
abortFile=~/store-s/abort
```

#### 6、启动服务器

##### ①、启动NameServer集群

分别启动rocketmqOS1与rocketmqOS2两个主机中的NameServer。启动命令完全相同。

```shell
nohup sh bin/mqnamesrv &
tail -f ~/logs/rocketmqlogs/namesrv.log
```

##### ②、启动两个Master

分别启动rocketmqOS1与rocketmqOS2两个主机中的broker master。注意，它们指定所要加载的配置文件是不同的。

```shell
nohup sh bin/mqbroker -c conf/2m-2s-async/broker-a.properties &
tail -f ~/logs/rocketmqlogs/broker.log
```

```shell
nohup sh bin/mqbroker -c conf/2m-2s-async/broker-b.properties &
tail -f ~/logs/rocketmqlogs/broker.log
```

##### ③、启动两个Slave

分别启动rocketmqOS1与rocketmqOS2两个主机中的broker slave。注意，它们指定所要加载的配置文件是不同的。

```shell
nohup sh bin/mqbroker -c conf/2m-2s-async/broker-b-s.properties &
tail -f ~/logs/rocketmqlogs/broker.log
```

```shell
nohup sh bin/mqbroker -c conf/2m-2s-async/broker-a-s.properties &
tail -f ~/logs/rocketmqlogs/broker.log
```

### 八、mqadmin命令

在mq解压目录的bin目录下有一个mqadmin命令，该命令是一个运维指令，用于对mq的主题，集群， broker 等信息进行管理。

#### 1、修改bin/tools.sh

在运行mqadmin命令之前，先要修改mq解压目录下bin/tools.sh配置的JDK的ext目录位置。本机的ext目录在<font color="#00CED1">/usr/java/jdk1.8.0_161/jre/lib/ext</font> 。

使用vim命令打开tools.sh文件，并在JAVA_OPT配置的-Djava.ext.dirs这一行的后面添加ext的路径。

![](https://pic.imgdb.cn/item/617ae2d62ab3f51d91696393.jpg){width="6.106944444444444in" height="0.53125in"}

```properties
JAVA_OPT="${JAVA_OPT} -server -Xms1g -Xmx1g -Xmn256m -
XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=128m"
JAVA_OPT="${JAVA_OPT} -
Djava.ext.dirs=${BASE_DIR}/lib:${JAVA_HOME}/jre/lib/ext:${JAVA_HOME}/lib/
ext:/usr/java/jdk1.8.0_161/jre/lib/ext"
JAVA_OPT="${JAVA_OPT} -cp ${CLASSPATH}"
```

#### 2、运行mqadmin

直接运行该命令，可以看到其可以添加的commands。通过这些commands可以完成很多的功能。

![](https://pic.imgdb.cn/item/617ae36c2ab3f51d9169cdd2.jpg){width="8.26388888888889in" height="5.439583333333333in"}


#### 3、该命令的官网详解

该命令在官网中有详细的用法解释。

<https://github.com/apache/rocketmq/blob/master/docs/cn/operation.md>

![](https://pic.imgdb.cn/item/617ae3cb2ab3f51d916a0e21.jpg){width="6.106944444444444in" height="1.5631944444444446in"}

![](https://pic.imgdb.cn/item/617ae3f52ab3f51d916a29a8.jpg){width="6.106944444444444in" height="4.1375in"}
