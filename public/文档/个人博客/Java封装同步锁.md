
> 先来看一段简单的同步锁代码
```java
@Controller
public class DemoController {

    private final Logger logger = LoggerFactory.getLogger(DemoController.class);

    @RequestMapping("/process/{orderId}")
    @ResponseBody
    public Map<String, Object> process(@PathVariable("orderId") String orderId) throws Exception {
        synchronized (this) {
            logger.debug("[{}] 开始", orderId);
            Thread.sleep(1500);
            logger.debug("[{}] 结束", orderId);
        }

        Map<String, Object> map = new HashMap();
        map.put("result", "success");
        return map;
    }
}
```
这段代码使用了 synchronized 同步锁（锁对象是this），但是出现了一个问题，对于同一个订单的id请求时，在多线程环境下就不应该再进入这段处理代码中，
比如orderId=001时已经进入了 synchronized 中开始执行了，此时又进来一个 orderId=001的请求，因为orderId一致，就不应该再进来。
但实际情况是：因为同步锁对象是 this，而两次请求的对象不同，自然不属于同一个对象，导致 synchronized 并不会起作用。

> 修改上面的代码，使其同一个 orderId 不能再进入 同步锁中
```java
@Controller
public class DemoController {

    private final Logger logger = LoggerFactory.getLogger(DemoController.class);

    @RequestMapping("/process/{orderId}")
    @ResponseBody
    public Map<String, Object> process(@PathVariable("orderId") String orderId) throws Exception {
        synchronized (orderId.intern()) {   // 将 orderId 变成一个 字符串常量池
            logger.debug("[{}] 开始", orderId);
            Thread.sleep(1500);
            logger.debug("[{}] 结束", orderId);
        }

        Map<String, Object> map = new HashMap();
        map.put("result", "success");
        return map;
    }
}
```
上述代码，将同一个 orderId 的请求变成了字符串常量池，这样，多个请求时，虽然每次都是一个新的String对象，但是这里锁的却是字符串值，因此是相等的，所以可以起到作用。

> 那么除了上面的字符串常量池方式，我们还可以自己维护一个缓存池对象，每次来一个orderId时从缓存池中获取对象。
```java
@Controller
public class DemoController {

    private final Logger logger = LoggerFactory.getLogger(DemoController.class);

    Map<String, Object> mutexCache = new HashMap<>();

    @RequestMapping("/process/{orderId}")
    @ResponseBody
    public Map<String, Object> process(@PathVariable("orderId") String orderId) throws Exception {
        Object mutex4Key = mutexCache.get(orderId);
        if(mutex4Key == null){
            mutex4Key = new Object();
            // 如果缓存中没有，则新建一个放进去
            mutexCache.put(orderId, mutex4Key);
        }
        synchronized (mutex4Key) {   // 将 orderId 变成一个 字符串常量池
            logger.debug("[{}] 开始", orderId);
            Thread.sleep(1500);
            logger.debug("[{}] 结束", orderId);
            // 业务执行完，删除缓存
            mutexCache.remove(orderId);
        }

        Map<String, Object> map = new HashMap();
        map.put("result", "success");
        return map;
    }
}
```
上面写法会带来一个问题：当有大量的请求到来时，会出现前一个线程在判断 mutex4Key==null 后，然后开始new了，但还没有push进去，但此时后一个线程进来了，
它得到的判断是 mutex4Key==null，导致又开始new了。所以会有这种错误情况出现。那怎么解决呢？可以给if判断加一个同步锁：
```java
@Controller
public class DemoController {

    private final Logger logger = LoggerFactory.getLogger(DemoController.class);

    Map<String, Object> mutexCache = new HashMap<>();

    @RequestMapping("/process/{orderId}")
    @ResponseBody
    public Map<String, Object> process(@PathVariable("orderId") String orderId) throws Exception {
        Object mute4Key = null;
        synchronized (this){
            mute4Key = mutexCache.get(orderId);
            if (mute4Key == null){
                mute4Key = new Object();
                mutexCache.put(orderId, mute4Key);
            }
        }

        synchronized (mute4Key) {   // 锁对象是 缓存中对应的 value
            logger.debug("[{}] 开始", orderId);
            Thread.sleep(1500);
            logger.debug("[{}] 结束", orderId);
            // 业务执行完，删除缓存
            mutexCache.remove(orderId);
        }
        Map<String, Object> map = new HashMap();
        map.put("result", "success");
        return map;
    }
}
```

> 上面代码写的有点繁琐了，其实我们在构建缓存时可以使用 ConcurrentHashMap，ConcurrentHashMap本身就是线程安全的map的实现
```java
// 缓存锁
    Map<String, Object> mutexCache = new ConcurrentHashMap<>(); // ConcurrentHashMap 线程安全的
    @RequestMapping("/process/{orderId}")
    @ResponseBody
    public Map<String, Object> process(@PathVariable("orderId") String orderId) throws Exception {
        Object mute4Key = mutexCache.computeIfAbsent(orderId, k -> new Object());

        synchronized (mute4Key) {   // 锁对象是 缓存中对应的 value
            logger.debug("[{}] 开始", orderId);
            Thread.sleep(1500);
            logger.debug("[{}] 结束", orderId);
            // 业务执行完，删除缓存
            mutexCache.remove(orderId);
        }
        Map<String, Object> map = new HashMap();
        map.put("result", "success");
        return map;
    }
```

相关代码参考: https://github.com/hello-github-ui/java_base/blob/master/lock/src/main/java/com/example/lock/LockApplication.java
