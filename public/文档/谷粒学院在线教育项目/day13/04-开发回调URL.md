# 一、准备工作

## 1、全局配置的跳转路径

```
# 微信开放平台 重定向url
wx.open.redirect_url=http://回调地址/api/ucenter/wx/callback
```

## 2、修改当前项目启动端口号为8150

## 3、测试回调是否可用

在WxApiController中添加方法

```
@GetMapping("callback")
public String callback(String code, String state, HttpSession session) {

    //得到授权临时票据code
    System.out.println("code = " + code);
    System.out.println("state = " + state);
}
```

# 二、后台开发

# 1、添加依赖

```
 <!--httpclient-->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
</dependency>
<!--commons-io-->
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
</dependency>
<!--gson-->
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
</dependency>
```

## 2、创建httpclient工具类

放入util包

```
HttpClientUtils.java
```

## 3、创建回调controller方法

在WxApiController.java中添加如下方法

```
/**
* @param code
* @param state
* @return
*/
@GetMapping("callback")
public String callback(String code, String state){

    //得到授权临时票据code
    System.out.println(code);
    System.out.println(state);

    //从redis中将state获取出来，和当前传入的state作比较
    //如果一致则放行，如果不一致则抛出异常：非法访问

    //向认证服务器发送请求换取access_token
    String baseAccessTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token" +
        "?appid=%s" +
        "&secret=%s" +
        "&code=%s" +
        "&grant_type=authorization_code";

    String accessTokenUrl = String.format(baseAccessTokenUrl,
                                          ConstantPropertiesUtil.WX_OPEN_APP_ID,
                                          ConstantPropertiesUtil.WX_OPEN_APP_SECRET,
                                          code);

    String result = null;
    try {
        result = HttpClientUtils.get(accessTokenUrl);
        System.out.println("accessToken=============" + result);
    } catch (Exception e) {
        throw new GuliException(20001, "获取access_token失败");
    }

    //解析json字符串
    Gson gson = new Gson();
    HashMap map = gson.fromJson(result, HashMap.class);
    String accessToken = (String)map.get("access_token");
    String openid = (String)map.get("openid");

    //查询数据库当前用用户是否曾经使用过微信登录
    Member member = memberService.getByOpenid(openid);
    if(member == null){
        System.out.println("新用户注册");

        //访问微信的资源服务器，获取用户信息
        String baseUserInfoUrl = "https://api.weixin.qq.com/sns/userinfo" +
            "?access_token=%s" +
            "&openid=%s";
        String userInfoUrl = String.format(baseUserInfoUrl, accessToken, openid);
        String resultUserInfo = null;
        try {
            resultUserInfo = HttpClientUtils.get(userInfoUrl);
            System.out.println("resultUserInfo==========" + resultUserInfo);
        } catch (Exception e) {
            throw new GuliException(20001, "获取用户信息失败");
        }

        //解析json
        HashMap<String, Object> mapUserInfo = gson.fromJson(resultUserInfo, HashMap.class);
        String nickname = (String)mapUserInfo.get("nickname");
        String headimgurl = (String)mapUserInfo.get("headimgurl");

        //向数据库中插入一条记录
        member = new Member();
        member.setNickname(nickname);
        member.setOpenid(openid);
        member.setAvatar(headimgurl);
        memberService.save(member);
    }

    //TODO 登录

    return "redirect:http://localhost:3000";
}
```

## 4、业务层

业务接口：MemberService.java

```
Member getByOpenid(String openid);
```

业务实现：MemberServiceImpl.java

```
@Override
public Member getByOpenid(String openid) {

    QueryWrapper<Member> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("openid", openid);

    Member member = baseMapper.selectOne(queryWrapper);
    return member;
}
```
