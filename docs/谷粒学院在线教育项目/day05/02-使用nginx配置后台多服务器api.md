---
id: 02-使用nginx配置后台多服务器api
title: 02-使用nginx配置后台多服务器api
tags: [尚硅谷]
---

# **一、项目中的****Easy Mock**

config/dev.env.js 中BASE_API 为项目的easymock地址，目前具有模拟登录、登出、获取用户信息的功能

```
BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
```

## 

**登录：**/user/login

**获取用户信息：**/user/info?token=admin

**登出：**/user/logout

config/dev.env.js，只有一个api地址的配置位置，而我们实际的后端有很多微服务，所以接口地址有很多，

我们可以使用nginx反向代理让不同的api路径分发到不同的api服务器中

# **二、配置nginx反向代理**

## 1、安装window版的nginx

将nginx-1.12.0.zip解压到开发目录中

如：E:\development\nginx-1.12.0-guli-api

双击nginx.exe运行nginx

访问：localhost

## 2、配置nginx代理

在Nginx中配置对应的微服务服务器地址即可

注意：最好修改默认的 80端口到81

```
http {
    server {
        listen       81;
        ......
    }，
    
    ......
    server {

        listen 8201;
        server_name localhost;

        location ~ /edu/ {           
             proxy_pass http://localhost:8101;
        }
        
        location ~ /user/ {   
             rewrite /(.+)$ /mock/5950a2419adc231f356a6636/vue-admin/$1  break; 
             proxy_pass https://www.easy-mock.com;
        }
    }
}
```

## **3、重启nginx**

```
nginx -s reload
```

## 4、测试

访问讲师列表接口：http://localhost:8201/admin/edu/teacher

访问获取用户信息接口：http://localhost:8201/user/info?token=admin

# 三、配置开发环境

## 1、修改config/dev.env.js

```
BASE_API: '"http://127.0.0.1:8201"'
```

## **2、重启前端程序**

修改配置文件后，需要手动重启前端程序