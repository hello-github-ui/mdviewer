
## Redis 简介

基于内存进行存储，支持key-value的存储形式，底层是用C语言编写的

基于key-value形式的数据字典，结构非常简单，没有数据表的概念，直接用键值对的形式完成数据的管理，Redis支持5种数据类型：

- 字符串
- 列表
- 集合
- 有序集合
- 哈希

## 安装 Redis

### 下载

[https://redis.io/download](https://redis.io/download)

### 解压，并在本地硬盘任意位置创建文件夹，在其中创建3个子文件夹

- bin：放置启动 redis 的可执行文件
- db：放置数据文件
- etc：放置配置文件，设置redis服务的端口、日志文件位置、数据文件位置等

同时将解压后（或者安装后的所有文件）都拷贝到创建的这个文件夹下面

![](https://img.imgdb.cn/item/604b874d5aedab222ceb5789.png)

### 启动redis服务

打开终端，进入到上一步新建的目录下面

先启动server：

```bash
./redis-server.exe ./redis.windows.conf
```

当然你也可以将server 注册为一个服务，但是我不建议这样做

再启动 client：

```bash
./redis-cli.exe
```

对数据进行操作：

```bash
set key value
get key
```

退出client：shutdown

## Spring Boot整合Redis

spring data Redis 操作 redis

- 1、新建 maven 工程，添加如下依赖：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>springbootredis</artifactId>
    <version>1.0-SNAPSHOT</version>

<!--    切记先引入springboot工程的  parent-->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.1.RELEASE</version>
    </parent>

    <dependencies>

<!--        web依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

<!--        springboot 整合redis，使用的是spring data 来操作redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

<!--        连接池是 apache 提供的 -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-pool2</artifactId>
        </dependency>

<!--        lombok 简化代码，主要是简化entity 与 数据库的映射代码-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>

    </dependencies>

</project>
```

- 2、创建实体类，必须实现序列化接口，否则无法存入redis缓存数据库

```java
package com.example.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @author latin-xiao-mao
 * @date 2020/7/17 19:26
 * @description 因为要存入 redis 中，故必须需要实现 Serializable 接口
 * 因为是给内存中存，所以必须完成序列化操作
 * @className Student
 */
@Data // 使用lombok 简化代码（比如getter/setter）
public class Student implements Serializable {

	private String name;

	private Integer id;

	private Double score;

	private Date birthday;
}
```

- 3、创建控制器

```java
package com.example.controller;

import com.example.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author latin-xiao-mao
 * @date 2020/7/17 19:43
 * @description
 * @className StudentHandler
 */
@RestController
public class StudentHandler {

	//redis为我们提供了一个操作data的操作对象
	@Autowired // 启动时会自动为我们创建一个实例对象，只需要注入即可
	private RedisTemplate redisTemplate;

	/**
	 * 往redis中存入数据对象
	 * @param student
	 * 这里为什么要写 @RequestBody呢，因为我们要将客户端传过来的 JSON对象 转换为Java实体类对象
	 */
	@PostMapping("/set")
	public void set(@RequestBody Student student){

		// 然后我们直接通过 redisTemplate 来操作数据，但是必须先调用 opsForValue()方法（此方法将key，value直接封装成一个对象来操作）
		redisTemplate.opsForValue().set("student", student);
	}

	@GetMapping("/get/{key}") // 表明 /get/ 后面的是一个 变量
	public Student get(@PathVariable("key") String key){ // pathvariable 通过变量名称key来获取实际的值

		return (Student) redisTemplate.opsForValue().get(key);
	}
}
```

- 4、创建配置文件application.yml

```yaml
spring:
    redis:
        database: 0 # 0表示统一的数据库，一般不用修改
        host: 127.0.0.1
        port: 6379
```

- 5、创建启动类

```java
package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author latin-xiao-mao
 * @date 2020/7/17 19:57
 * @description
 * @className Application
 */
@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		// 启动
		SpringApplication.run(Application.class, args);
	}
}
```

### Redis 如何存储5种数据类型

- 字符串

```java
@GetMapping("/{key}")
public String stringTest(@PathVariable("key") String key){

	redisTemplate.opsForValue().set(key, "hello world!!!");
	String result = (String) redisTemplate.opsForValue().get(key);
	return result;
}
```

- 列表

```java
/**
 * 列表的存取，redis列表实际相当于java 中的list
 */
@GetMapping("/list")
public List<Object> listTest(){
	// 存
	ListOperations<String, Object> listOperations = redisTemplate.opsForList(); // List 数据类型就用 opsForList
	listOperations.leftPush("list", "hello");
	listOperations.leftPush("list", "world");
	listOperations.leftPush("list", 123);

	// 取
	List<Object> list = listOperations.range("list", 0, 2);
	return list;
}
```

![](https://img.imgdb.cn/item/604b874d5aedab222ceb578c.png)

- 集合

```java
/**
 * redis中的集合 实际相当于Java中的 set，无序不重复
 * @return
 */
@GetMapping("/set")
public Set<Object> setTest(){

	// setOperations key一般是 string类型，value取决于你实际的需求
	SetOperations<String, Object> setOperations = redisTemplate.opsForSet();
	setOperations.add("set", "hello"); // 测试是否不可重复
	setOperations.add("set", "hello");
	setOperations.add("set", "world");
	setOperations.add("set", "world");
	setOperations.add("set", 0);
	setOperations.add("set", 0);

	// 取
	Set<Object> set = setOperations.members("set");
	return set;
}
```

![](https://img.imgdb.cn/item/604b874d5aedab222ceb578e.png)

- 有序集合

```java
/**
 * 有序集合 zset
 * @return
 */
@GetMapping("/zset")
public Set<String> zsetTest(){
	ZSetOperations<String, String> zSet = redisTemplate.opsForZSet();
	zSet.add("zset", "hello", 1); // 第三个参数是，存储的位置，可以通过这个控制它的顺序
	zSet.add("zset", "world", 2);
	zSet.add("zset", "java", 3);
	Set<String> set = zSet.range("zset", 0, 2);
	return set;
}
```

![](https://img.imgdb.cn/item/604b874d5aedab222ceb5791.png)

- 哈希

传统的HashMap是由key，value组成的，格式为：

HashMap<key, value>

而redis中的 哈希是下面格式的，它多了一个参数key：

HashOperations<key, hashkey, value>

key：每一组数据的id

hashkey和value是一组完整的 HashMap数据，通过key来区分不同的HashMap

![](https://img.imgdb.cn/item/604b874d5aedab222ceb579b.png)

```java
/**
 * 哈希，需要三个参数：key,hashKey,value
 * @return
 */
@GetMapping("/hash")
public String hashTest(){
	HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
	// 第一个key，取出一组 hashMap，第二个key，取出value
	hashOperations.put("key", "hashKey", "hello");
	String str = hashOperations.get("key", "hashKey");
	return str;

}
```

![](https://img.imgdb.cn/item/604b878c5aedab222ceb7daa.png)


![](https://img.imgdb.cn/item/604b88385aedab222cebd92b.jpg)
![](https://img.imgdb.cn/item/604b88385aedab222cebd92d.jpg)
![](https://img.imgdb.cn/item/604b88385aedab222cebd931.jpg)
![](https://img.imgdb.cn/item/604b88385aedab222cebd937.jpg)
![](https://img.imgdb.cn/item/604b88385aedab222cebd93a.jpg)
