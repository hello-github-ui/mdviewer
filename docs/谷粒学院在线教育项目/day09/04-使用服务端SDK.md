---
id: 04-使用服务端SDK
title: 04-使用服务端SDK
tags: [尚硅谷]
---

# 一、服务端SDK

## 1、简介

sdk的方式将api进行了进一步的封装，不用自己创建工具类。

我们可以基于服务端SDK编写代码来调用点播API，实现对点播产品和服务的快速操作。

## 2、功能介绍

- SDK封装了对API的调用请求和响应，避免自行计算较为繁琐的 API签名。
- 支持所有点播服务的API，并提供了相应的示例代码。
- 支持7种开发语言，包括：Java、Python、PHP、.NET、Node.js、Go、C/C++。
- 通常在发布新的API后，我们会及时同步更新SDK，所以即便您没有找到对应API的示例代码，也可以参考旧的示例自行实现调用。

# 二、使用SDK

## 1、安装

参考文档：https://help.aliyun.com/document_detail/57756.html

添加maven仓库的配置和依赖到pom

```
<repositories>
    <repository>
        <id>sonatype-nexus-staging</id>
        <name>Sonatype Nexus Staging</name>
        <url>https://oss.sonatype.org/service/local/staging/deploy/maven2/</url>
        <releases>
            <enabled>true</enabled>
        </releases>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
    </repository>
</repositories>
  <dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>aliyun-java-sdk-core</artifactId>
    <version>4.3.3</version>
  </dependency>
  <dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>aliyun-java-sdk-vod</artifactId>
    <version>2.15.5</version>
  </dependency>
  <dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.8.2</version>
  </dependency>

```

## 2、初始化

参考文档：https://help.aliyun.com/document_detail/61062.html

根据文档示例创建 AliyunVODSDKUtils.java

```
package com.atguigu.aliyunvod.util;

public class AliyunVodSDKUtils {
    
    public static DefaultAcsClient initVodClient(String accessKeyId, String accessKeySecret) throws ClientException {
        String regionId = "cn-shanghai";  // 点播服务接入区域
        DefaultProfile profile = DefaultProfile.getProfile(regionId, accessKeyId, accessKeySecret);
        DefaultAcsClient client = new DefaultAcsClient(profile);
        return client;
    }
}
```

## 3、创建测试类

创建 VodSdkTest.java

```
package com.atguigu.aliyunvod;

public class VodSdkTest {
    
    String accessKeyId = "你的accessKeyId";
    String accessKeySecret = "你的accessKeySecret";
    
}
```

# 三、创建测试用例

参考文档：https://help.aliyun.com/document_detail/61064.html

## 1、**获取视频播放凭证**

根据文档中的代码，修改如下

```
/**
     * 获取视频播放凭证
     * @throws ClientException
     */
@Test
public void testGetVideoPlayAuth() throws ClientException {

    //初始化客户端、请求对象和相应对象
    DefaultAcsClient client = AliyunVodSDKUtils.initVodClient(accessKeyId, accessKeySecret);
    GetVideoPlayAuthRequest request = new GetVideoPlayAuthRequest();
    GetVideoPlayAuthResponse response = new GetVideoPlayAuthResponse();

    try {

        //设置请求参数
        request.setVideoId("视频ID");
        //获取请求响应
        response = client.getAcsResponse(request);

        //输出请求结果
        //播放凭证
        System.out.print("PlayAuth = " + response.getPlayAuth() + "\n");
        //VideoMeta信息
        System.out.print("VideoMeta.Title = " + response.getVideoMeta().getTitle() + "\n");
    } catch (Exception e) {
        System.out.print("ErrorMessage = " + e.getLocalizedMessage());
    }

    System.out.print("RequestId = " + response.getRequestId() + "\n");
}
```

## 2、获取视频播放地址

```
/**
     * 获取视频播放地址
     * @throws ClientException
     */
@Test
public void testGetPlayInfo() throws ClientException {

    //初始化客户端、请求对象和相应对象
    DefaultAcsClient client = AliyunVodSDKUtils.initVodClient(accessKeyId, accessKeySecret);
    GetPlayInfoRequest request = new GetPlayInfoRequest();
    GetPlayInfoResponse response = new GetPlayInfoResponse();

    try {

        //设置请求参数
        //注意：这里只能获取非加密视频的播放地址
        request.setVideoId("视频ID");
        //获取请求响应
        response = client.getAcsResponse(request);

        //输出请求结果
        List<GetPlayInfoResponse.PlayInfo> playInfoList = response.getPlayInfoList();
        //播放地址
        for (GetPlayInfoResponse.PlayInfo playInfo : playInfoList) {
            System.out.print("PlayInfo.PlayURL = " + playInfo.getPlayURL() + "\n");
        }
        //Base信息
        System.out.print("VideoBase.Title = " + response.getVideoBase().getTitle() + "\n");

    } catch (Exception e) {
        System.out.print("ErrorMessage = " + e.getLocalizedMessage());
    }

    System.out.print("RequestId = " + response.getRequestId() + "\n");
}
```