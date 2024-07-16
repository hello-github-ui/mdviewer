
## AOP简介

来自于官方的定义：

> Aspect-oriented Programming (AOP) complements Object-oriented Programming (OOP) by providing another way of thinking about program structure. The key unit of modularity in OOP is the class, whereas in AOP the unit of modularity is the aspect. Aspects enable the modularization of concerns that cut across multiple types and objects.

面向切面编程，是spring框架中的一个重要内容。利用 aop 可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高代码的可重用性，提高开发效率。

<mark>AOP一般用来实现以下几个功能：</mark>

> 日志记录，性能统计，安全控制，权限控制，事务处理，异常处理，资源池管理等

目前最受欢迎的aop库有两个，一个是 <mark>AspectJ</mark>，另一个是 <mark>Spring AOP</mark>。

我们先来学习 Spring AOP，在学习之前，先学习几个 AOP 中的知识点：

* Aspect：即切面，切面一般定义为一个java类，切面在 ApplicationContext 中的 `<aop:aspect>` 来配置。
* Joinpoint：即连接点，程序执行的某个点，比如方法执行。构造函数调用或者字段赋值等。在Spring AOP中，连接点只会有 方法调用（method execution）。
* Advice：即通知，切面对于某个连接点所产生的动作，可以理解位：在连接点处要执行的代码，例如 TestAspect 对 com.spring.service 包下所有类的方法进行日志记录的动作就是一个Advice。其中一个切面可以包含多个Advice。Advice总共有如下5种类型：

		1. 前置通知（Before advice）：在某个连接点（joinpoint）之前执行，xml中在<aop:aspect>里面使用<aop:before>元素进行声明；注解中使用@Before声明。
	 	2. 后置通知（After advice）：在某个连接点退出的时候执行，xml中在<aop:aspect>里面使用<aop:after>元素进行声明；注解中使用@After声明。
	 	3. 返回后通知（After return advice）：在某个连接点正常完成后执行的通知，不包括抛出异常的情况。xml中在<aop:aspect>里面使用<after-returning>元素进行声明。注解中使用@AfterReturning声明。
		4. 环绕通知（Around advice）：包围一个连接点的通知，可以在方法的调用前后完成自定义的行为，也可以选择不执行。xml中在<aop:aspect>里面使用<aop:around>元素进行声明；注解中使用@Around声明。
	 	5. 抛出异常后通知（After throwing advice）：在方法抛出异常退出时执行的通知。xml中在<aop:aspect>里面使用<aop:after-throwing>元素进行声明；注解中使用@AfterThrowing声明。

* Pointcut：即切点，一个匹配连接点的正则表达式。当一个连接点匹配到切点时，一个关联到这个切点的特定的通知（Advice）会被执行。
* Weaving：即编织，负责将切面和目标对象链接，以创建通知对象，在Spring AOP中没有这个东西

在spring框架中，aop有两种动态代理方式，其一是基于JDK的动态代理，需要代理的类实现某一个接口，其二是基于CGLIB 的方式，该方式不需要类实现接口就能进行代理。

## 实操

接下来我们通过一个小demo来实操演练以下。

### 创建项目

我们直接在 idea 中新建一个 spring initializr 工程，什么也不需要选择，创建一个空的即可。

然后修改pom文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.example</groupId>
    <artifactId>spring-aop-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>spring-aop-demo</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>11</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>

```



### 创建业务对象

业务对象就是一个普通的Java类，然后有自己的一些业务逻辑。我们就以下面这个<strong>微信服务</strong>对象为例，这个对象只有一个简单的业务逻辑就是：分享文章到朋友圈。

在如下图所示位置创建对象：

![](https://img.imgdb.cn/item/605ed9da8322e6675c26b157.jpg)

<mark>注意，上面使用到了 `@Service`  注解，表示将这个类注入到 spring ioc 中，成为spring容器中的一个  bean（只有这样后，才会在下面使用 getBean 获取到这个  bean 对象）</mark>

在该类中定义如上的方法。

然后在 SpringAopDemoApplication 启动类中增加如下代码：

```java
package com.example.springaopdemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class SpringAopDemoApplication {

    public static void main(String[] args) {

        ApplicationContext applicationContext = SpringApplication.run(SpringAopDemoApplication.class, args);
        WeixinService weixinService = applicationContext.getBean(WeixinService.class);
        weixinService.share("https://www.jianshu.com/u/db7d7a281529");
    }

}
```

之后点击运行按钮，启动程序后在控制台可以看到如下输出：

![](https://img.imgdb.cn/item/605edaba8322e6675c275584.jpg)



### 定义切面（Aspect）

上面我们创建了自己的业务对象，那么我们现在创建一个切面，使用 AOP 在不对业务进行修改的情况下增加一些额外的功能，比如在分享到朋友圈之后我们将这次分享记录到日志中。

我们按照上面的方法在同样的包中创建类 `WeixinServiceAspect`

```java
package com.example.springaopdemo;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * 定义 切面（Aspect）
 */
@Aspect
@Component
public class WeixinServiceAspect {

    // 使用返回后通知（Advice）
    @AfterReturning("execution(public void WeixinService.share(String))")
    public void log(JoinPoint joinPoint){   //JoinPoint连接点

        System.out.println(joinPoint.getSignature() + " executed");
    }
}
```

同时在 SpringAopDemoApplication 中增加注解 `@EnableAspectJAutoProxy`

那我们现在再来看一下程序的运行结果与上面比较有什么不一样呢？

![](https://img.imgdb.cn/item/605edffb8322e6675c2a2722.jpg)

经过比较我们可以发现增加的日志记录已经在控制台输出了，但是很显然我们并没有修改我们原先的业务对象。

到这里，大家应该对 aop 有了一个比较直观的感受了，下面我们就来具体说一说 Spring AOP 给我们提供了哪些 api 来使用。

### API

#### Aspect 定义

![](https://img.imgdb.cn/item/605ee1ae8322e6675c2b23f4.jpg)

在spring 中使用 Aspect 需要使用 @Component 直接将其标记为一个 Bean，

并且使用 @Aspect 注解将其标记为一个切面

然后在该类中定义上面我们所说的切点，通知等。

#### PointCut 定义

这里我们说一下 pointcut 的表达式如何写，我们首先将上面例子中的切面类修改为如下：

![](https://img.imgdb.cn/item/605ee2878322e6675c2b913e.jpg)

* 使用 @Pointcut 注解的便是切点的定义

* 切点定义在方法上，并使用 @Pointcut 注解，注解中的值便是切点的表达式

* 切点的名称就是方法的名称，这里是 shareCut() ，注意这里有括号

* 若要将具体的通知 Advice 关联在某个切点上，只需要在 Advice 的注解上写上切点的名称就可以了，如下：

	```java
	// 使用返回后通知（Advice）
	// 连接点有多个，通过名称就将通知与某个切点关联起来了
	    @AfterReturning("shareCut()")
	    public void log(JoinPoint joinPoint){   //JoinPoint连接点

	        System.out.println(joinPoint.getSignature() + " executed");
	    }
	```

#### Pointcut 指示器

切点的表达式以指示器开始，指示器就是一种关键字，用来告诉 Spring AOP 如何匹配连接点，Spring AOP 提供了以下几种指示器

* e'x'ecution
* within
* this 和 target
* args
* @target
* @annotation

下面我们依次说明这些指示器的作用

**execution**

该指示器用来匹配方法执行连接点，即匹配哪个方法执行，如

```java
@Pointcut("execution(public String com.example.springaopdemo.UserDao.findById(Long))")
```

上面这个切点会匹配在UserDao类中findById方法的调用，并且需要该方法是public的，返回值类型为String，只有一个Long的参数。

切点的表达式同时还支持<strong>宽字符</strong>匹配，如：

```java
@Pointcut("execution(* com.example.springaopdemo.UserDao.*(..))")
```

上面的表达式中，第一个宽字符 * 匹配 任何返回类型，第二个宽字符 * 匹配 任何方法名，最后的参数 (..) 表达式匹配 <strong>任意数量任意类型</strong> 的参数，也就是说该切点会匹配类中所有方法的调用。

**within**
如果要匹配一个类中所有方法的调用，便可以用 within 指示器

```java
@Pointcut("within(com.example.springaopdemo.UserDao)")
```

这样便可以匹配该类中所有方法的调用了。同时我们还可以匹配某个包下面的所有类的所有方法调用，如下面的例子：

```java
@Pointcut("within(com.example.springaopdemo..*)")
```

**this和target**

如果目标对象实现了任何接口，Spring AOP会创建基于 CGLIB 的动态代理，这时候需要使用 target 指示器

如果目标对象没有实现任何接口，Spring AOP 会创建基于 JDK 的动态代理，这时候需要使用 this 指示器

```java
@Pointcut("target(com.example.springaopdemo.A)") A实现了某个接口
@Pointcut("this(com.example.springaopdemo.B)") B没有实现任何一个接口
```

**args**
该指示器用来匹配具体的方法参数

```java
@Pointcut("execution(* *..find*(Long))")
```

这个切点会匹配任何以 find 开头并且只有一个 Long 类型的参数的方法

如果我们想匹配一个以 Long 类型开始的参数，后面的参数类型不做限制，我们可以使用如下的表达式：

```java
@Pointcut("execution(* *..find*(Long))")
```

**@target**
该指示器不要和 target 指示器混淆，该指示器用于匹配连接点所在的类是否拥有指定类型的注解，如：

```java
@Pointcut("@target(org.springframework.stereotype.Repository)")
```

**@annotation**
该指示器用于匹配连接点的方法是否具有某个注解

```java
@Pointcut("@annotation(org.springframework.scheduling.annotion.Async)")
```

**组合切点表达式**
切点表达式可以通过 && 、|| 和 ！等操作符来组合，如

```java
@Pointcut("@target(org.springframework.stereotype.Repository)")
public void repositoryMethods() {}

@Pointcut("execution(* *..create*(Long,..))")
public void firstLongParamMethods() {}

@Pointcut("repositoryMethods() && firstLongParamMethods()")
public void entityCreationMethods() {}
```

上面的第三个切点需要同时满足第一个和第二个切点表达式

#### Advice定义

Advice通知，即在连接点处要执行的代码，分为以下几种类型

- Around
- Before
- After

#### 开启 Advice

如果要在Spring中使用Spring AOP，需要开启 Advice，使用 @EnableAspectJAutoProxy 注解就可以了，代码如下：

```java
@SpringBootApplication
@EnableAspectJAutoProxy
public class SpringAopDemoApplication{

}
```

### 自定义AOP Annotation

我们来了解一下如何使用aop以及aop的api，下面我们尝试自己定义一个aop的Annotation，@CalculateExecuteTime，任何使用该注解的方法，都会打印出该方法的执行时间

#### 创建 Annotation

```java
package com.example.springaopdemo.myaop.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 任何使用该注解的方法，都会打印出该方法的执行时间
 */
@Target(ElementType.METHOD) //该注解作用的对象
@Retention(RetentionPolicy.RUNTIME) //该注解使用的时机
public @interface CalculateExecuteTime {
}
```

#### 创建切面

```java
package com.example.springaopdemo.myaop.aspect;

import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * 切面aspect
 */
@Aspect
@Component
public class CalculateExecuteTimeAspect {
}
```

#### 创建切点和通知

```java
package com.example.springaopdemo.myaop.aspect;

import com.example.springaopdemo.myaop.annotation.CalculateExecuteTime;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * 切面aspect
 */
@Aspect
@Component
public class CalculateExecuteTimeAspect {

    // 切点表达式，表示加了CalculateExecuteTime注解的都是切点，路径是自定义注解的全路径
    @Pointcut("@annotation(com.example.springaopdemo.myaop.annotation.CalculateExecuteTime)")
    public void pointcut(){

    }

    @Around("@annotation(calculateExecuteTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint, CalculateExecuteTime calculateExecuteTime) throws Throwable{

        long start = System.currentTimeMillis();
        Object proceed = joinPoint.proceed();
        long executionTime = System.currentTimeMillis() - start;
        System.out.println(joinPoint.getSignature() + " executed in " + executionTime + "ms");
        return proceed;
    }
}
```

这里的 ProceedingJoinPoint 代表连接的方法

#### 在方法上加上自定义注解

```java
package com.example.springaopdemo;

import com.example.springaopdemo.myaop.annotation.CalculateExecuteTime;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * 创建业务对象
 * 业务对象就是一个普通的java类，然后有自己的一些业务逻辑。我们就以下面这个 <strong>微信服务</strong>
 * 对象为例，这个对象只有一个简单的业务逻辑就是 分享文章到朋友圈
 */

@Service //注入到spring ioc 中的 bean
public class WeixinService {

    @CalculateExecuteTime
    public void share(String articleUrl){

        try {
            TimeUnit.SECONDS.sleep(3);
        }catch (Exception exception){

        }
    }
}
```

这里我们模拟该方法会执行3s的时间，运行程序以后得到如下结果：

![](https://img.imgdb.cn/item/605f60f08322e6675c7b52e0.jpg)

可以看到该 Advice 已经生效了。

<i>本文参考于: [Spring AOP 教程](https://www.jianshu.com/p/a21256903fdd) 和 [Spring AOP 自定义注解实现](https://juejin.cn/post/6944382595434020877/) </i>

