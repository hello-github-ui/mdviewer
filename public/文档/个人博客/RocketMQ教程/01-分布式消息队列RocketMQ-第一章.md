# 分布式消息队列RocketMQ学习文档

> 本文资料来源：尚硅谷 | 本文发表时RocketMQ的版本：`v4.9.2` | 本资料是第一章内容，本文档总共有四章。
<hr/>

> 文章目录：
<ul>
<li><a target="_blank" href="https://hello-blogger-ui.blogspot.com/2021/10/rocketmq.html">分布式消息队列RocketMQ-学习文档-第一章</a></li>
<li><a target="_blank" href="https://hello-blogger-ui.blogspot.com/2021/10/rocketmq_29.html">分布式消息队列RocketMQ-学习文档-第二章</a></li>
<li><a target="_blank" href="https://hello-blogger-ui.blogspot.com/2021/10/rocketmq_62.html">分布式消息队列RocketMQ-学习文档-第三章</a></li>
<li><a target="_blank" href="https://hello-blogger-ui.blogspot.com/2021/10/rocketmq_32.html">分布式消息队列RocketMQ-学习文档-第四章</a></li>
</ul>

## 第1章 RocketMQ概述

### 一、MQ概述

#### 1、MQ简介

MQ，Message Queue，是一种提供<font color="#6495ED">消息队列服务</font>
的中间件，也称为消息中间件，是一套提供了消息生产、存储、消费全过程API的软件系统。消息即数据。一般消息的体量不会很大。

#### 2、MQ用途

从网上可以查看到很多的关于MQ用途的叙述，但总结起来其实就以下三点。

##### ①、限流削峰

MQ可以将系统的<font color="#6495ED">超量</font>请求暂存其中，以便系统后期可以慢慢进行处理，从而避免了请求的丢失或系统被压垮。

![](https://pic.imgdb.cn/item/617ac4172ab3f51d914740c3.jpg){width="6.106944444444444in" height="2.9805555555555556in"}

##### ②、异步解耦

上游系统对下游系统的调用若为同步调用，则会大大降低系统的吞吐量与并发度，且系统耦合度太高。而异步调用则会解决这些问题。所以两层之间若要实现由同步到异步的转化，一般性做法就是，在这两层间添加一个MQ层。

![](https://pic.imgdb.cn/item/617ac4442ab3f51d91477c8d.jpg){width="4.7in" height="2.595138888888889in"}

##### ③、数据收集

分布式系统会产生海量级数据流，如：业务日志、监控数据、用户行为等。针对这些数据流进行实时或批量采集汇总，然后对这些数据流进行大数据分析，这是当前互联网平台的必备技术。通过MQ完成此类数据收集是最好的选择。

#### 3、常见MQ产品

##### ①、ActiveMQ

ActiveMQ是使用Java语言开发一款MQ产品。早期很多公司与项目中都在使用。但现在的社区活跃度已经很低。现在的项目中已经很少使用了。

##### ②、RabbitMQ

RabbitMQ是使用ErLang语言开发的一款MQ产品。其吞吐量较Kafka与RocketMQ要低，且由于其不是Java语言开发，所以公司内部对其实现定制化开发难度较大。

##### ③、Kafka

Kafka是使用Scala/Java语言开发的一款MQ产品。其最大的特点就是高吞吐率，常用于大数据领域的实时计算、日志采集等场景。其没有遵循任何常见的MQ协议，而是使用自研协议。对于Spring
Cloud Net ix，其仅支持RabbitMQ与Kafka。

##### ④、RocketMQ

RocketMQ是使用Java语言开发的一款MQ产品。经过数年阿里双11的考验，性能与稳定性非常高。其没有遵循任何常见的MQ协议，而是使用自研协议。对于Spring
Cloud Alibaba，其支持RabbitMQ、Kafka，但提倡使用RocketMQ。

<hr/>

**对比**

| 关键词   | ActiveMQ | RabbitMQ | Kafka            | RocketMQ         |
|-------|----------|----------|------------------|------------------|
| 开发语言  | Java     | Erlang   | Java             | Java             |
| 单机吞吐量 | 万级       | 万级       | 十万级              | 十万级              |
| Topic | -        | -        | 百级Topic时会影响系统吞吐量 | 千级Topic时会影响系统吞吐量 |
| 社区活跃度 | 低        | 高        | 高                | 高                |

#### 4、MQ常见协议

一般情况下MQ的实现是要遵循一些常规性协议的。常见的协议如下：

##### ①、JMS

JMS，Java Messaging Service（Java消息服务）。是Java平台上有关MOM（Message Oriented Middleware，面向消息的中间件
PO/OO/AO）的技术规范，它便于消息系统中的Java应用程序进行消息交换，并且通过提供标准的产生、发送、接收消息的接口，简化企业应用的开发。ActiveMQ是该协议的典型实现。

##### ②、STOMP

STOMP，Streaming Text Orientated Message
Protocol（面向流文本的消息协议），是一种MOM设计的简单文本协议。STOMP提供一个可互操作的连接格式，允许客户端与任意STOMP消息代理（Broker）进行交互。ActiveMQ是该协议的典型实现，RabbitMQ通过插件可以支持该协议。

##### ③、AMQP

AMQP，Advanced Message Queuing
Protocol（高级消息队列协议），一个提供统一消息服务的应用层标准，是应用层协议的一个开放标准，是一种MOM设计。基于此协议的客户端与消息中间件可传递消息，并不受客户端/中间件不同产品，不同开发语言等条件的限制。
RabbitMQ是该协议的典型实现。

##### ⑤、MQTT

MQTT，Message Queuing Telemetry
Transport（消息队列遥测传输），是IBM开发的一个即时通讯协议，是一种二进制协议，主要用于服务器和低功耗IoT（物联网）设备间的通信。该协议支持所有平台，几乎可以把所有联网物品和外部连接起来，被用来当做传感器和致动器的通信协议。
RabbitMQ通过插件可以支持该协议。

### 二、RocketMQ概述

#### 1、RocketMQ简介

![](https://pic.imgdb.cn/item/617ac2a02ab3f51d91451943.jpg){width="6.106944444444444in" height="2.928472222222222in"}

RocketMQ是一个统一消息引擎、轻量级数据处理平台。

RocketMQ是一款阿里巴巴开源的消息中间件。2016年11月28日，阿里巴巴向 Apache 软件基金会捐赠RocketMQ，成为 Apache 孵化项目。2017
年 9 月 25 日，Apache 宣布 RocketMQ孵化成为 Apache 顶级项目（TLP ），成为国内首个互联网中间件在 Apache 上的顶级项目。

**官网地址**：<font color="#6495ED">[http://rocketmq.apache.org](http://rocketmq.apache.org/)</font>

#### 2、RocketMQ发展历程

![](https://pic.imgdb.cn/item/617ac2082ab3f51d91444f78.jpg){width="6.106944444444444in" height="2.501388888888889in"}

> 2007年，阿里开始五彩石项目，Notify作为项目中<font color="#6495ED">交易核心消息流转系统</font>，应运而生。Notify系统是RocketMQ的雏形。
>
> 2010年，B2B大规模使用ActiveMQ作为阿里的消息内核。阿里急需一个具有<font color="#6495ED">海量堆积能力</font>的消息系统。
>
> 2011年初，Kafka开源。淘宝中间件团队在对Kafka进行了深入研究后，开发了一款新的MQ，MetaQ。
>
> 2012年，MetaQ发展到了v3.0版本，在它基础上进行了进一步的抽象，形成了RocketMQ，然后就将其进行了开源。
>
> 2015年，阿里在RocketMQ的基础上，又推出了一款专门针对阿里云上用户的消息系统Aliware MQ。
>
> 2016年双十一，RocketMQ承载了<font color="#6495ED">万亿级</font>消息的流转，跨越了一个新的里程碑。11月28日，阿里巴巴
>
> 向 Apache 软件基金会捐赠 RocketMQ，成为 Apache 孵化项目。
>
> 2017 年 9 月 25 日，Apache 宣布 RocketMQ孵化成为 Apache 顶级项目（TLP ），成为国内首个互联网中间件在 Apache 上的顶级项目。
