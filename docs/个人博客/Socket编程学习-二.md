---
id: Socket编程学习-二
title: Socket编程学习-二
tags: [个人博客]
---


> Socket 编程学习篇

接上一篇[Socket编程学习(一)](https://hello-gitee-ui.gitee.io/posts/d9f23af9/)内容

## 服务端优化

在上面的例子中，服务端仅仅只是接受了一个Socket请求，并处理了它，然后就结束了。但是在实际的开发中，一个Socket服务往往需要服务大量的Socket请求，那么就不能再服务完一个Socket的时候就关闭了，这时候就可以采用死循环的方式来接收请求。

### 循环方式
#### 服务端
```java
package socket.服务端优化.循环方式;

import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * @author 030
 * @date 1:18 2021/11/9
 * @description 采用循环接受请求并处理
 */
public class SocketServer {

    public static void main(String args[]) throws IOException {
        // 监听指定的端口
        int port = 55533;
        ServerSocket server = new ServerSocket(port);
        // server将一直等待连接的到来
        System.out.println("server将一直等待连接的到来");
        while (true) {
            Socket socket = server.accept();
            // 建立好连接后，从socket中获取输入流，并建立缓冲区进行读取
            InputStream is = socket.getInputStream();
            byte[] bytes = new byte[1024];
            int len;
            StringBuilder sb = new StringBuilder();
            while ((len = is.read(bytes)) != -1) {
                // 注意指定编码格式，发送方和接收方一定要统一，建议使用UTF-8
                sb.append(new String(bytes, 0, len, "UTF-8"));
            }
            System.out.println("get message from client: " + sb);
            is.close();
            socket.close();
        }
    }
}
```
这种一般也是新手写法，但是能够循环处理多个Socket请求，不过当一个请求的处理比较耗时的时候，后面的请求将会被阻塞，所以一般都是采用多线程的方式来处理Socket，即每一个Socket请求时，就创建一个线程来处理它。

不过在实际开发中，创建的线程会交给线程池来处理，为了：线程复用，创建线程耗时，回收线程慢。

为了防止短时间内高并发，指定线程池大小，超过指定数量线程的任务将被等待，防止短时间内创建大量线程导致资源耗尽，服务挂掉。

### 多线程线程池方式
#### 服务端
```java
package socket.服务端优化.多线程方式;

import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author 030
 * @date 1:22 2021/11/9
 * @description 通过线程池构造多线程的方式来实现服务端一直可以响应请求
 */
public class SocketServer {
    public static void main(String[] args) throws Exception {
        // 构造指定端口的 ServerSocket
        ServerSocket server = new ServerSocket(55533);
        // server将一直等待连接的到来
        System.out.println("server将一直等待连接的到来");
        //如果使用多线程，那就需要线程池，防止并发过高时创建过多线程耗尽资源
        ExecutorService threadPool = Executors.newFixedThreadPool(100);

        while (true) {
            Socket socket = server.accept();

            Runnable runnable = () -> {
                try {
                    // 建立好连接后，从socket中获取输入流，并建立缓冲区进行读取
                    InputStream is = socket.getInputStream();
                    byte[] bytes = new byte[1024];
                    int len;
                    StringBuilder sb = new StringBuilder();
                    while ((len = is.read(bytes)) != -1) {
                        // 注意指定编码格式，发送方和接收方一定要统一，建议使用UTF-8
                        sb.append(new String(bytes, 0, len, "UTF-8"));
                    }
                    System.out.println("get message from client: " + sb);
                    is.close();
                    socket.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            };
            threadPool.submit(runnable);
        }
    }
}
```

> 使用线程池的方式，算是一种成熟的方式，可以应用在生产中。
ServerSocket有以下3个属性：
* SO_TIMEOUT：表示等待客户连接的超时时间。一般不设置，会持续等待。
* SO_REUSEADDR：表示是否允许重用服务器所绑定的地址。一般不设置。
* SO_RCVBUF：表示接收数据的缓冲区的大小。一般不设置。

> 在使用TCP通信传输信息时，更多的是使用对象的形式来传输，可以使用`ObjectOutputStream`对象序列化流来传递对象，比如：
```java
ObjectOutputStream os = new ObjectOutputStream(socket.getOutputStream());
User user = new User("admin", "123);
os.writeObject(user);
```

> 本节内容参考于[码农家园](https://www.codenong.com/cs106175296/)，在此致谢~~~
> 本节示例[代码仓库](https://github.com/hello-github-ui/java_base/tree/master/net/src/main/java/socket/%E5%9F%BA%E7%A1%80%E6%A8%A1%E5%BC%8F)


