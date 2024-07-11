---
title: SSM框架-流程
cover: 'https://img.imgdb.cn/item/604b93e95aedab222cf35162.jpg'
categories:
  - 记事本
tags:
  - Java
abbrlink: 20946
date: 2018-11-03 18:11:15
---

# springmvc 的配置

**springmvc配置文件需要配置的内容**

```xml
<!--配置包扫描-->
<context:component-scan base-package="com.latinos.*"/>

<!--开启springmvc注解驱动-->
<mvc:annotation-driven/>

<!--配置视图解析器：是为了在url上不写 pages InternalResourceViewResolver-->
<bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!--配置前缀-->
        <property name="prefix" value="/pages/"/>
        <!--配置后缀-->
        <property name="suffix" value=""/>
</bean>


<!--配置文件上传 CommonsMultipartResolver-->
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <!--配置默认编码-->
        <property name="defaultEncoding" value="UTF-8"/>
        <!--配置所有文件的总上传大小-->
        <property name="maxUploadSize" value="10485760"/>
</bean>


<!--配置定时器任务（可以暂时不写）-->

```

![](https://img.imgdb.cn/item/604b89905aedab222cec940c.jpg)

# spring 的配置

```xml
<!--配置读取jdbc.properties配置文件的工具类 PropertyPlaceholderConfigurer-->
    <bean id="propertyPlaceholderConfigurer" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
        <!--配置 jdbc.properties 的读取位置 如果是 资源文件，路径就是用 . 隔开的，
        当处于 resouces 直接根目录下的，就是 classpath，若有子包的话，就是 classpath* -->
        <property name="location" value="classpath:jdbc.properties"/>
    </bean>


<!--配置数据源及数据库连接池 BasicDataSource-->
<bean id="basicDataSource" class="org.apache.commons.dbcp.BasicDataSource">
        <property name="driverClassName" value="${driverClassName}"></property>
        <property name="url" value="${url}"/>
        <property name="username" value="${username}"/>
        <property name="password" value="${password}"/>
</bean>


<!--读取书写sql语句的xml文件的位置 SqlSessionFactoryBean-->
<bean id="sqlSessionFactoryBean" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!--注入数据源-->
        <property name="dataSource" ref="basicDataSource"/>
        <!--指定xml文件的存放位置-->
        <property name="mapperLocations" value="classpath*:com/latin/mapper/*.xml"></property>
        <!--指定mybatis主配置文件-->
        <property name="configLocation" value="classpath:mybatis.xml"/>
</bean>


<!--读取dao层接口类，将dao层与对应的xml文件关联 MapperScannerConfigurer-->
<bean id="mapperScannerConfigurer" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!--指定dao接口类的位置-->
        <property name="basePackage" value="com.latin.mapper"/>
</bean>
```

![](https://img.imgdb.cn/item/604b89905aedab222cec941b.jpg)

# mybatis 的配置

```xml
<!--配置别名-->

<!--配置PageHelper插件-->
<plugins>
        <plugin interceptor="com.github.pagehelper.PageHelper">
            <property name="dialect" value="mysql"/>
        </plugin>
</plugins>
```

![](https://img.imgdb.cn/item/604b89905aedab222cec9429.jpg)

# web.xml 的配置

```xml
<!--配置默认访问首页-->
<welcome-file-list>
        <welcome-file>/pages/front/index.jsp</welcome-file>
</welcome-file-list>

<!--配置处理中文乱码的过滤器类-->
<filter>
    <filter-name>characterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>characterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>

<!--配置监听器，读取applicationContext.xml文件：ContextLoaderListener-->
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:applicationContext.xml</param-value>
</context-param>
<listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>

<!--配置springmvc的核心类-->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springmvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>*.do</url-pattern>
    </servlet-mapping>

<!--配置错误页面-->
    <error-page>
        <error-code>404</error-code>
        <location>/pages/error/404.jsp</location>
    </error-page>

```

![](https://img.imgdb.cn/item/604b89905aedab222cec9433.jpg)

------



<div align="middle">柳梢青·茅舍疏篱
	-- 宋代：杨无咎
</div>

> 茅舍疏篱。半飘残雪，斜卧低枝。可更相宜，烟笼修竹，月在寒溪。宁宁伫立移时。判瘦损、无妨为伊。谁赋才情，画成幽思，写入新诗。
