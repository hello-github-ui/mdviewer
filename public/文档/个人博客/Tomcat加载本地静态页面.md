# 加载静态页面

> 我们经常有这样一些需求：本地电脑有静态页面需要访问，但是呢又不想使用本地`File:///`
>
这种文件协议访问，想通过本地启动一个服务器实现动态访问这些页面。这时候呢，我们通常会使用一些本身提供服务器的编辑器来使用，比如vsCode，HbuilderX等；但是呢有时候又不想单独下载这些东西，刚好本地又有Apache这类服务器，于是就可以通过本地tomcat来实现这个需求。

## 前提

Apache Tomcat windows 版本先下载解压到本地

## 修改配置文件

修改 `$TOMCAT_HOME\conf\server.xml` 文件：
在文件的自带 `<host></host>` 下面新增如下代码，

```xml

<Host name="127.0.0.1" debug="0" appBase="webapps" unpackWARs="true" autoDeploy="true" xmlValidation="false"
      xmlNamespaceAware="false">
    <Context path="" docBase="liang" debug="0" reloadable="true" crossContext="true"/>
    <Logger className="org.apache.catalina.logger.FileLogger" directory="logs" prefix="tot_log." suffix=".txt"
            timestamp="true"/>
</Host>
```

其中Host name="ip地址“ docBase="放在webapps目录下的html文件的文件夹名" 即 \webapps\liang\xxx.html

## 放置源文件夹

配置好后，把含有html的文件夹放在tomcat的webapps目录下（appBase="webapps"）

## 启动tomcat

启动tomcat，访问http://localhost:8080/liang/xxx.html即可

> 注意：如果是在linux环境下启动tomcat时需要修改startup.sh的权限，运行命令：chmod 777 *.sh 即可

# Tomcat中部署war包

## 修改配置文件

> 这里我使用最快速的一种方式，即通过修改 conf/server.xml 文件来实现

也是在自带的 `<host></host>` 内容下面增加如下代码（当然，你可以选择在下面重新再写一个host标签，然后里面写内容；也可以直接就在这个host中做修改，加入如下代码）

```xml

<Context docBase="/home/xiaohua/my-app/yaoqishan" path="/" debug="0" reloadable="false"/>
```

在 server.xml 的host中添加如上一行代码即可成功实现将 yaoqishan.war 包部署到 tomcat 中，
启动 tomcat ，访问 http://localhost:8080/ 即可访问成功。
之后每次修复bug后，只需要将你的war包上传到 /home/xiaohua/my-app/yaoqishan 目录下替换掉原有的war包即可。

## linux 下查看开放的端口

`firewall-cmd --list-all`

## linux 下开放端口

`firewall-cmd --add-port=8080/tcp --permanent`

## linux 下立即刷新配置

`firewall-cmd --reload`

## 移除指定端口

`firewall-cmd --permanent --remove-port=8080/tcp`

## 查看防火墙状态

`systemctl status firewalld`

## 开启防火墙

`systemctl start firewalld`

## 关闭防火墙

`systemctl stop firewalld`




