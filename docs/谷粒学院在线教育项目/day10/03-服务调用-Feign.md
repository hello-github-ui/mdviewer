---
id: 03-服务调用-Feign
title: 03-服务调用-Feign
tags: [尚硅谷]
---

# 一、Feign

## 1、基本概念

- Feign是Netflix开发的声明式、模板化的HTTP客户端， Feign可以帮助我们更快捷、优雅地调用HTTP API。
- Feign支持多种注解，例如Feign自带的注解或者JAX-RS注解等。
- Spring Cloud对Feign进行了增强，使Feign支持了Spring MVC注解，并整合了Ribbon和Eureka，从而让Feign的使用更加方便。
- Spring Cloud Feign是基于Netflix feign实现，整合了Spring Cloud Ribbon和Spring Cloud Hystrix，除了提供这两者的强大功能外，还提供了一种声明式的Web服务客户端定义的方式。
- Spring Cloud Feign帮助我们定义和实现依赖服务接口的定义。在Spring Cloud feign的实现下，只需要创建一个接口并用注解方式配置它，即可完成服务提供方的接口绑定，简化了在使用Spring Cloud Ribbon时自行封装服务调用客户端的开发量。

##  

# 二、实现服务调用

## 1、需求

删除课时的同时删除云端视频

## 2、在service模块添加pom依赖

```
<!--服务调用-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

## 3、在调用端的启动类添加注解

```
@EnableFeignClients
```

**4、创建包和接口**

创建client包

@FeignClient注解用于指定从哪个服务中调用功能 ，名称与被调用的服务名保持一致。

@GetMapping注解用于对被调用的微服务进行地址映射。

@PathVariable注解一定要指定参数名称，否则出错

@Component注解防止，在其他位置注入CodClient时idea报错

```
package com.guli.edu.client;

@FeignClient("service-vod")
@Component
public interface VodClient {
    @DeleteMapping(value = "/eduvod/vod/video/{videoId}")
    public R removeVideo(@PathVariable("videoId") String videoId);
}
```

**5、调用微服务**

在调用端的VideoServiceImpl中调用client中的方法

```
@Override
public boolean removeVideoById(String id) {

    //查询云端视频id
    Video video = baseMapper.selectById(id);
    String videoSourceId = video.getVideoSourceId();
    //删除视频资源
    if(!StringUtils.isEmpty(videoSourceId)){
        vodClient.removeVideo(videoSourceId);
    }

    Integer result = baseMapper.deleteById(id);
    return null != result && result > 0;
}
```

## 6、测试 

启动相关微服务

测试删除课时的功能