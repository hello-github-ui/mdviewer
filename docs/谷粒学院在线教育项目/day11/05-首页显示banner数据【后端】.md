---
id: 05-首页显示banner数据【后端】
title: 05-首页显示banner数据【后端】
tags: [尚硅谷]
---

# 一、新建banner微服务

## 1、在service模块下创建子模块service-cms

![img](/assets/2025/05/26/day11/d79d7768-2cd2-45f0-9a22-943640d4764a.png)

**2、使用代码生成器生成banner代码**

**（1）创建crm_banner表**

![img](/assets/2025/05/26/day11/1727b963-4fbe-443e-9f60-3640b71b2a6a.png)

![img](/assets/2025/05/26/day11/bf4bd795-0192-42c0-855e-173ffb1b7a94.png)

**（2）生成代码**

![img](/assets/2025/05/26/day11/0dd82880-1dcb-47f6-bf8d-0965a918565f.png)

**3、****配置****application.properties**

```
# 服务端口
server.port=8004
# 服务名
spring.application.name=service-cms

# mysql数据库连接
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/guli?serverTimezone=GMT%2B8
spring.datasource.username=root
spring.datasource.password=root

#返回json的全局时间格式
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
spring.jackson.time-zone=GMT+8

#配置mapper xml文件的路径
mybatis-plus.mapper-locations=classpath:com/atguigu/cmsservice/mapper/xml/*.xml

#mybatis日志
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

## 4、创建启动类

创建CmsApplication.java

```
@SpringBootApplication
@ComponentScan({"com.atguigu"}) //指定扫描位置
@MapperScan("com.atguigu.cmsservice.mapper")
public class CmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(CmsApplication.class, args);
    }
}
```

# 二、创建banner服务接口

## 1、创建banner后台管理接口

**banner后台分页查询、添加、修改、删除接口**

```
@RestController
@RequestMapping("/eduservice/banner")
@CrossOrigin
public class CrmBannerController {

    @Autowired
    private CrmBannerService bannerService;

    @ApiOperation(value = "获取Banner分页列表")
    @GetMapping("{page}/{limit}")
    public R index(
            @ApiParam(name = "page", value = "当前页码", required = true)
            @PathVariable Long page,

            @ApiParam(name = "limit", value = "每页记录数", required = true)
            @PathVariable Long limit) {

        Page<CrmBanner> pageParam = new Page<>(page, limit);
        bannerService.pageBanner(pageParam,null);
        return R.ok().data("items", pageParam.getRecords()).data("total", pageParam.getTotal());
    }

    @ApiOperation(value = "获取Banner")
    @GetMapping("get/{id}")
    public R get(@PathVariable String id) {
        CrmBanner banner = bannerService.getBannerById(id);
        return R.ok().data("item", banner);
    }

    @ApiOperation(value = "新增Banner")
    @PostMapping("save")
    public R save(@RequestBody CrmBanner banner) {
        bannerService.saveBanner(banner);
        return R.ok();
    }

    @ApiOperation(value = "修改Banner")
    @PutMapping("update")
    public R updateById(@RequestBody CrmBanner banner) {
        bannerService.updateBannerById(banner);
        return R.ok();
    }

    @ApiOperation(value = "删除Banner")
    @DeleteMapping("remove/{id}")
    public R remove(@PathVariable String id) {
        bannerService.removeBannerById(id);
        return R.ok();
    }
}
```

## 2、创建banner前台查询接口

**首页获取banner数据接口**

```
@RestController
@RequestMapping("/educms/banner")
@Api(description = "网站首页Banner列表")
@CrossOrigin //跨域
public class BannerApiController {

    @Autowired
    private CrmBannerService bannerService;

    @ApiOperation(value = "获取首页banner")
    @GetMapping("getAllBanner")
    public R index() {
        List<CrmBanner> list = bannerService.selectIndexList();
        return R.ok().data("bannerList", list);
    }

}
```

# 三、实现banner后台管理前端

实现banner后台的添加修改删除和分页查询操作，和其他后台管理模块类似