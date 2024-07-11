---
title: SpringBoot程序的部署及运行
cover: 'https://pic.imgdb.cn/item/612110704907e2d39c44f884.jpg'
categories:
  - code
tags:
  - Java
  - SpringBoot
abbrlink: 3499
date: 2020-01-06 03:40:04
---

# <font color=#FF8C00>将 spring boot 应用程序打包成 jar 包</font>

 我们使用 spring boot 的 maven 插件来构建管理整个应用程序，使用 `mvn package` 将应用程序打包成一个 jar 包

# 将 该 jar 包上传到 服务器
 上传到服务器大致有两种方式（常见的）：1）通过 `xftp` 这种方式；2）本文将要介绍的这种，我不太建议使用 xftp，因为它太常见了，不新奇，
 说说第二种方式吧：首先我们在 linux 服务器上，下载 `lrzsz` 插件，命令为：`yum -y install lrzsz`,然后上传文件就输入命令：`rz -y `，`-y` 表示强制覆盖原有文件（建议使用），`rz` 表示上传，当然了，`sz` 就表示下载喽。之后就会打开一个 windows 的文件资源管理器窗口，你选择目标 jar 包即可实现上传（前提，选择好你的上传目录）

# 运行
 上传到服务器的指定位置了，接下来就是如何运行了！
 我们都知道，java 程序在你本地运行时就是选择好入口 main，然后运行即可。但是在 linux 上就不是那么简单了。
 大致呢有两种：一种是直接手动启动；一种是通过写一个脚本文件来启动。
 直接启动：
 `java -jar 目标.jar >> catalina.out 2>&1 &`,什么意思呢？就是将 tomcat（spring-boot-starter-web 自带 tomcat） 的启动内容 标准错误流重定向到标准输出流(2 >&1)，并且以在后台运行的形式去运行(&)。

# 脚本启动
 编写启动脚本
 ``` sh
 #!/bin/bash
 PROJECTNAME=目标jar名称(不需要带.jar)
 pid=`ps -ef |grep $PROJECTNAME |grep -v "grep" |awk '{print $2}'`
 if [ $pid ]; then
 ​    echo "$PROJECTNAME  is  running  and pid=$pid"
 else
    echo "Start success to start $PROJECTNAME ...."
    nohup java -jar 目标.jar  >> catalina.out  2>&1 &
 fi
 ```

 在该 `.sh`(脚本文件)中，使用到了命令 `nohup java -jar  ...` nohup 就是 no hangup（不挂起），即 即使用户登出，
 关闭终端后，该进程还会继续运行；采用 nohup 命令后，那么就会在当前脚本所在的同级目录下生成一个 `nohup.out` 的文件，
 该文件就记录了整个应用启动过程以及之后运行中的所有日志内容（因为我们是将 `2` 标准错误 作为输出内容的，
 而标准错误默认是包括所有的输出内容+错误内容）。之后你只需要运行这个脚本即可启动应用程序啦：`./start.sh`，
 如果你想查看一下日志内容，你可以输入：`vi nohup.out`，或者你只想查看最后几行内容：`tail -f nohup.out`即可。

# 脚本关闭
 编写关闭脚本:
 其实我们一般是不需要关闭脚本的，因为我们通常是这样操作的：进入到该应用程序所在的目录：
 `ps aux | grep java` 或 `ps -ef |  grep java` 二者并没有什么太大的区别，看你喜欢用哪个命令了，
 然后找到该应用程序的 `pid`, 然后 `kill -g 该pid` 就杀死这个进程了。但是其实这样很麻烦，
 你习惯了还好，一般我还是建议你使用 关闭脚本的

 ```sh
 #!/bin/bash
 PROJECTNAME=目标

 pid=`ps -ef |grep $PROJECTNAME |grep -v "grep" |awk '{print $2}' `

 if [ $pid ]; then

 ​    echo "$PROJECTNAME is  running  and pid=$pid"

 ​    kill -9 $pid

 ​    if [[ $? -eq 0 ]];then

 ​       echo "sucess to stop $PROJECTNAME "

 ​    else

 ​       echo "fail to stop $PROJECTNAME "

 ​     fi

 fi
 ```

一般目录结构就是如下图所示：
![](https://img.imgdb.cn/item/604b869e5aedab222ceae3ca.jpg)


我实际中用的这个启动脚本内容如下：

![](https://img.imgdb.cn/item/604b869e5aedab222ceae3cf.jpg)

ps:至于有人说的可能需要在 pom.xml 中指定 入口类，大家也可以这样做，请自行百度。

![](https://img.imgdb.cn/item/604b869e5aedab222ceae3d5.jpg)
