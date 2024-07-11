# 一、OAuth2解决什么问题

## 1、OAuth2提出的背景

照片拥有者想要在云冲印服务上打印照片，云冲印服务需要访问云存储服务上的资源

## ![img](./assets/100bc1f9-5d9e-4600-9b2b-e3eb7ad7d9c5.jpg)

## 2、图例

资源拥有者：照片拥有者

客户应用：云冲印

受保护的资源：照片

![img](./assets/f1b879ec-1c76-42bc-991b-d68c140b4e49.jpg)

## 3、方式一：用户名密码复制

适用于同一公司内部的多个系统，不适用于不受信的第三方应用

![img](./assets/f57f30af-3bdd-4c5d-b4d3-f934b4f9f608.jpg)

## 4、方式二：通用开发者key

适用于合作商或者授信的不同业务部门之间

![img](./assets/959b118f-62e0-452c-bcbe-6ba6e6c5f9af.jpg)

## 5、方式三：办法令牌

接近OAuth2方式，需要考虑如何管理令牌、颁发令牌、吊销令牌，需要统一的协议，因此就有了OAuth2协议

![img](./assets/e6c08180-79bc-4804-8c7b-e371ab168bb5.jpg)

# 二、现代微服务安全

除了开放系统授权，OAuth2还可以应用于现代微服务安全

## 1、传统单块应用的安全

![img](./assets/5fe36f0a-23e9-44b7-bf2d-19d694d47b7b.jpg)

## 2、现代微服务安全

现代微服务中系统微服务化以及应用的形态和设备类型增多，不能用传统的登录方式

核心的技术不是用户名和密码，而是token，由AuthServer颁发token，用户使用token进行登录

![img](./assets/0795984b-635b-478f-96c6-c48872e59fb6.jpg)

## 3、典型的OAuth2应用

![img](./assets/151181a6-edbb-4f57-87fb-bfd7213daf2f.jpg)

# 三、总结

![img](./assets/0378fb81-a658-42d5-aac4-d006bb1c66b5.jpg)

**四、****OAuth2最简向导**

川崎高彦：OAuth2领域专家，开发了一个OAuth2 sass服务，OAuth2 as Service，并且做成了一个公司

再融资的过程中为了向投资人解释OAuth2是什么，于是写了一篇文章，《OAuth2最简向导》