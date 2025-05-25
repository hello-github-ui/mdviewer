---
id: 05-JWT令牌
title: 05-JWT令牌
tags: [尚硅谷]
---

# 一、整合JWT令牌

## 1、callback中生成jwt

在WxApiController.java的callback方法的最后添加如下代码

```
// 生成jwt
String token = JwtUtils.geneJsonWebToken(member.getId(),member.getNickName());

//存入cookie
//CookieUtils.setCookie(request, response, "guli_jwt_token", token);

//因为端口号不同存在蛞蝓问题，cookie不能跨域，所以这里使用url重写
return "redirect:http://localhost:3000?token=" + token;
```

## 2、前端打印token

在layout/defaullt.vue中打印获取的token值

```
export default {

  created() {
    console.log(this.$route.query.token)
  }
}
```