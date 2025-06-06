---
id: 08-首页数据添加Redis缓存
title: 08-首页数据添加Redis缓存
tags: [尚硅谷]
---

# 一、Redis介绍

Redis是当前比较热门的NOSQL系统之一，它是一个开源的使用ANSI c语言编写的key-value存储系统（区别于MySQL的二维表格的形式存储。）。和Memcache类似，但很大程度补偿了Memcache的不足。和Memcache一样，Redis数据都是缓存在计算机内存中，不同的是，Memcache只能将数据缓存到内存中，无法自动定期写入硬盘，这就表示，一断电或重启，内存清空，数据丢失。所以Memcache的应用场景适用于缓存无需持久化的数据。而Redis不同的是它会周期性的把更新的数据写入磁盘或者把修改操作写入追加的记录文件，实现数据的持久化。

Redis的特点：

1，Redis读取的速度是110000次/s，写的速度是81000次/s；

2，原子 。Redis的所有操作都是原子性的，同时Redis还支持对几个操作全并后的原子性执行。

3，支持多种数据结构：string（字符串）；list（列表）；hash（哈希），set（集合）；zset(有序集合)

4，持久化，集群部署

5，支持过期时间，支持事务，消息订阅

**
**



**二、项目集成Redis**

**1、在common模块添加依赖**

由于redis缓存是公共应用，所以我们把依赖与配置添加到了common模块下面，在common模块pom.xml下添加以下依赖

```
<!-- redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- spring2.X集成redis所需common-pool2-->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
    <version>2.6.0</version>
</dependency>
```

# 2、在service-base模块添加redis配置类 

![img](/assets/2025/05/26/day11/b9900bf3-cfc2-4d03-9143-756a7805e223.png)

**RedisConfig.java**

```
@EnableCaching
@Configuration
public class RedisConfig extends CachingConfigurerSupport {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        RedisSerializer<String> redisSerializer = new StringRedisSerializer();
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        template.setConnectionFactory(factory);
        //key序列化方式
        template.setKeySerializer(redisSerializer);
        //value序列化
        template.setValueSerializer(jackson2JsonRedisSerializer);
        //value hashmap序列化
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        return template;
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisSerializer<String> redisSerializer = new StringRedisSerializer();
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        //解决查询缓存转换异常的问题
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        // 配置序列化（解决乱码的问题）,过期时间600秒
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(600))
              .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(redisSerializer))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(jackson2JsonRedisSerializer))
                .disableCachingNullValues();
        RedisCacheManager cacheManager = RedisCacheManager.builder(factory)
                .cacheDefaults(config)
                .build();
        return cacheManager;
    }
}
```

## 3、在接口中添加redis缓存

由于首页数据变化不是很频繁，而且首页访问量相对较大，所以我们有必要把首页接口数据缓存到redis缓存中，减少数据库压力和提高访问速度。

改造service-cms模块首页banner接口，首页课程与讲师接口类似

**3.1 Spring Boot****缓存注解**

### （1）缓存@Cacheable

根据方法对其返回结果进行缓存，下次请求时，如果缓存存在，则直接读取缓存数据返回；如果缓存不存在，则执行方法，并把返回的结果存入缓存中。一般用在查询方法上。

查看源码，属性值如下：

| **属性/方法名** | **解释**                                         |
| --------------- | ------------------------------------------------ |
| value           | 缓存名，必填，它指定了你的缓存存放在哪块命名空间 |
| cacheNames      | 与 value 差不多，二选一即可                      |
| key             | 可选属性，可以使用 SpEL 标签自定义缓存的key      |

### （2）缓存@CachePut

使用该注解标志的方法，每次都会执行，并将结果存入指定的缓存中。其他方法可以直接从响应的缓存中读取缓存数据，而不需要再去查询数据库。一般用在新增方法上。

查看源码，属性值如下：

| **属性/方法名** | **解释**                                         |
| --------------- | ------------------------------------------------ |
| value           | 缓存名，必填，它指定了你的缓存存放在哪块命名空间 |
| cacheNames      | 与 value 差不多，二选一即可                      |
| key             | 可选属性，可以使用 SpEL 标签自定义缓存的key      |

### （3）缓存@CacheEvict

使用该注解标志的方法，会清空指定的缓存。一般用在更新或者删除方法上

查看源码，属性值如下：

| **属性/方法名**  | **解释**                                                     |
| ---------------- | ------------------------------------------------------------ |
| value            | 缓存名，必填，它指定了你的缓存存放在哪块命名空间             |
| cacheNames       | 与 value 差不多，二选一即可                                  |
| key              | 可选属性，可以使用 SpEL 标签自定义缓存的key                  |
| allEntries       | 是否清空所有缓存，默认为 false。如果指定为 true，则方法调用后将立即清空所有的缓存 |
| beforeInvocation | 是否在方法执行前就清空，默认为 false。如果指定为 true，则在方法执行前就会清空缓存 |

**3.2 启动redis服务**

![img](/assets/2025/05/26/day11/a94950f7-61df-4b78-8dbd-2180521dbe98.png)

**3.3连接redis服务可能遇到的问题**

（1）关闭liunx防火墙

（2）找到redis配置文件， 注释一行配置

![img](/assets/2025/05/26/day11/clip_image001dcab0f21-5fb6-49e8-bca6-5cd74cc962f3.png)

（3）如果出现下面错误提示

![img](/assets/2025/05/26/day11/clip_image002364300c8-7319-484a-bf9b-2192ca5d373b.png)

修改 protected-mode yes

改为

protected-mode no

**3.4 banner接口改造**

**（1）在service-cms模块配置文件添加redis配置**

```
spring.redis.host=192.168.44.132
spring.redis.port=6379
spring.redis.database= 0
spring.redis.timeout=1800000

spring.redis.lettuce.pool.max-active=20
spring.redis.lettuce.pool.max-wait=-1
#最大阻塞等待时间(负数表示没限制)
spring.redis.lettuce.pool.max-idle=5
spring.redis.lettuce.pool.min-idle=0
```

**（2）修改CrmBannerServiceImpl，添加redis缓存注解**

```
@Service
public class CrmBannerServiceImpl extends ServiceImpl<CrmBannerMapper, CrmBanner> implements CrmBannerService {

    @Cacheable(value = "banner", key = "'selectIndexList'")
    @Override
    public List<CrmBanner> selectIndexList() {
        List<CrmBanner> list = baseMapper.selectList(new QueryWrapper<CrmBanner>().orderByDesc("sort"));
        return list;
    }

    @Override
    public void pageBanner(Page<CrmBanner> pageParam, Object o) {
        baseMapper.selectPage(pageParam,null);
    }

    @Override
    public CrmBanner getBannerById(String id) {
        return baseMapper.selectById(id);
    }

    @CacheEvict(value = "banner", allEntries=true)
    @Override
    public void saveBanner(CrmBanner banner) {
        baseMapper.insert(banner);
    }

    @CacheEvict(value = "banner", allEntries=true)
    @Override
    public void updateBannerById(CrmBanner banner) {
        baseMapper.updateById(banner);
    }

    @CacheEvict(value = "banner", allEntries=true)
    @Override
    public void removeBannerById(String id) {
        baseMapper.deleteById(id);
    }
}
```

## （3）在redis添加了key

![img](/assets/2025/05/26/day11/75535435-a0b4-4a51-845a-769eba08d79d.png)

**（4）通过源码查看到key生成的规则**

![img](/assets/2025/05/26/day11/f1d5ebb6-3341-4c52-8c30-a11726e6b0a3.png)