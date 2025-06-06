---
id: 01-服务端渲染技术NUXT-初始化NUXT
title: 01-服务端渲染技术NUXT-初始化NUXT
tags: [尚硅谷]
---

# 一、服务端渲染技术NUXT

## 1、什么是服务端渲染

服务端渲染又称SSR (Server Side Render)是在服务端完成页面的内容，而不是在客户端通过AJAX获取数据。

服务器端渲染(SSR)的优势主要在于：**更好的 SEO**，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。

如果你的应用程序初始展示 loading 菊花图，然后通过 Ajax 获取内容，抓取工具并不会等待异步完成后再进行页面内容的抓取。也就是说，如果 SEO 对你的站点至关重要，而你的页面又是异步获取内容，则你可能需要服务器端渲染(SSR)解决此问题。

另外，使用服务器端渲染，我们可以获得更快的内容到达时间(time-to-content)，无需等待所有的 JavaScript 都完成下载并执行，产生更好的用户体验，对于那些「内容到达时间(time-to-content)与转化率直接相关」的应用程序而言，服务器端渲染(SSR)至关重要。

## 2、什么是NUXT

Nuxt.js 是一个基于 Vue.js 的轻量级应用框架,可用来创建服务端渲染 (SSR) 应用,也可充当静态站点引擎生成静态站点应用,具有优雅的代码结构分层和热加载等特性。

官网网站：

https://zh.nuxtjs.org/

# 二、NUXT环境初始化

## 1、下载压缩包

https://github.com/nuxt-community/starter-template/archive/master.zip

## 2、解压

将template中的内容复制到 guli

## 3、安装ESLint

将`guli-admin`项目下的.eslintrc.js配置文件复制到当前项目下

## 4、修改package.json

name、description、author（必须修改这里，否则项目无法安装）

```
 "name": "guli",
 "version": "1.0.0",
 "description": "谷粒学院前台网站",
 "author": "Helen <55317332@qq.com>",
```

## 5、修改nuxt.config.js

修改`title: '{{ name }}'、content: '{{escape description }}'`

这里的设置最后会显示在页面标题栏和meta数据中

```html
head: {
    title: '谷粒学院 - Java视频|HTML5视频|前端视频|Python视频|大数据视频-自学拿1万+月薪的IT在线视频课程，谷粉力挺，老学员为你推荐',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'keywords', name: 'keywords', content: '谷粒学院,IT在线视频教程,Java视频,HTML5视频,前端视频,Python视频,大数据视频' },
      { hid: 'description', name: 'description', content: '谷粒学院是国内领先的IT在线视频学习平台、职业教育平台。截止目前,谷粒学院线上、线下学习人次数以万计！会同上百个知名开发团队联合制定的Java、HTML5前端、大数据、Python等视频课程，被广大学习者及IT工程师誉为：业界最适合自学、代码量最大、案例最多、实战性最强、技术最前沿的IT系列视频课程！' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
},
```

## 6、在命令提示终端中进入项目目录

## 7、安装依赖

```
npm install
```

![img](/assets/2025/05/26/day11/8e9bcd6d-6161-440b-aac2-bc9af65f5bc7-1721229130089-1.png)

## 8、测试运行

```
npm run dev
```

## 9、NUXT目录结构

（1）资源目录 assets

 用于组织未编译的静态资源如 LESS、SASS 或 JavaScript。

（2）组件目录 components

用于组织应用的 Vue.js 组件。Nuxt.js 不会扩展增强该目录下 Vue.js 组件，即这些组件不会像页面组件那样有 asyncData 方法的特性。

（3）布局目录 layouts

用于组织应用的布局组件。

（4）页面目录 pages

用于组织应用的路由及视图。Nuxt.js 框架读取该目录下所有的 .vue 文件并自动生成对应的路由配置。

（5）插件目录 plugins

用于组织那些需要在 根vue.js应用 实例化之前需要运行的 Javascript 插件。

（6）nuxt.config.js 文件

nuxt.config.js 文件用于组织Nuxt.js 应用的个性化配置，以便覆盖默认配置。

## 三、幻灯片插件 

## **1、安装插件**

```
npm install vue-awesome-swiper
```

## 2、配置插件

在 plugins 文件夹下新建文件 nuxt-swiper-plugin.js，内容是

```js
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper/dist/ssr'

Vue.use(VueAwesomeSwiper)
```

在 nuxt.config.js 文件中配置插件

将 plugins 和 css节点 复制到 module.exports节点下

```js
module.exports = {
  // some nuxt config...
  plugins: [
    { src: '~/plugins/nuxt-swiper-plugin.js', ssr: false }
  ],

  css: [
    'swiper/dist/css/swiper.css'
  ]
}
```