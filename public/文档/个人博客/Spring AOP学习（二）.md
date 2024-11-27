## 前言

我们通常在实际开发中有这样的需求场景：我需要在不改动原先的业务代码场景下，实现一些额外的功能，比如我计算一下执行某些代码耗时多久啊，我增加一些额外的日志输出啊，等等。。。
那么我们怎么实现呢？这个时候就可以用到我们的 AOP 了。
而 AOP 的切面呢，可以是某个类下面的某个方法，也可以是某个包下面的所有方法，还可以是凡是使用到某个注解的地方等，下面呢我们就让
AOP 去切凡是使用了某个注解的地方

## 定义注解

```java
package com.example.springaopdemo.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CalculateExecuteTime{
    // 该注解没有自身属性的定义
}
```

## 定义切面Aspect

```java
package com.example.springaopdemo.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * 切面：通过 @Aspect 来注解 切面
 */
@Aspect
@Component
public class CalculateExecuteTimeAspect{

    // 在连接点处要真正执行的代码，即你要实现的额外功能，此处是一个计算耗时的功能
    // @Around 环绕上面的自定义注解
    @Around("@annotation(com.example.springaopdemo.annotation.CalculateExecuteTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();
        Object proceed = joinPoint.proceed();   // 原业务代码继续原来的调用执行
        long executionTime = System.currentTimeMillis() - start;
        System.out.println(joinPoint.getSignature() + " 执行了 " + executionTime + "ms");
        return proceed;
    }
}
```

## 原先的业务代码层

这里我们模拟一下原先的业务代码，并在此处使用到上面的自定义注解

```java
package com.example.springaopdemo.test;

import com.example.springaopdemo.annotation.CalculateExecuteTime;
import org.springframework.stereotype.Service;
import java.util.Hashtable;
import java.util.Map;

@Service
public class TestService {

    @CalculateExecuteTime   // 只需要在原先的业务代码上面使用上面的自定义注解即可
    public void share(){
        Map<String, Object> map = new Hashtable<>();
        for (int i = 0; i < 100000; i++) {
            map.put(i + "", i + 1);
        }
    }
}
```

## 调用

因为我们这里没有一个完整的dao，service，controller层业务代码，所以只能采用如下方式测试一下效果
在我们的spring boot 启动类中获取 service bean来调用

```java
package com.example.springaopdemo;

import com.example.springaopdemo.test.TestService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class SpringAopDemoApplication {

    public static void main(String[] args) {
        ApplicationContext applicationContext = SpringApplication.run(SpringAopDemoApplication.class, args);
        TestService testService = applicationContext.getBean(TestService.class);
        testService.share();
    }

}
```

## 运行结果

![](https://img.imgdb.cn/item/606970d48322e6675c50da2f.jpg)

> 可以看到正如我们预期的那样，输出了原先业务代码的执行耗时时间
