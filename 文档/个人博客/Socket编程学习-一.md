
> Socket 编程学习篇

<hr/>

## 一、概念
TCP（Transmission Control Protocol 传输控制协议）是一种面向连接的、可靠的、基于字节流的传输层通信协议。在简化的计算机网络OSI模型中（四层模型从下到上分别是：物理层/数据链路层、网络层/IP层、传输层TCP/UDP、应用层HTTP/FTP等），它完成第四层传输层所指定的功能，用户数据报协议（UDP）是同一层内 另一个重要的传输协议。在因特网协议族（Internet protocol suite）中，TCP层是位于IP层之上，应用层之下的中间层。不同主机的应用层之间经常需要可靠的、像管道一样的连接，但是IP层不提供这样的流机制，而是提供不可靠的包交换。
应用层向TCP层发送用于网间传输的、用8位字节表示的数据流，然后TCP把数据流分区成适当长度的报文段（通常受该计算机连接的网络的数据链路层的最大传输单元（ MTU）的限制）。之后TCP把结果包传给IP层，由它来通过网络将包传送给接收端实体的TCP层。TCP为了保证不发生丢包，就给每个包一个序号，同时序号也保证了传送到接收端实体的包的按序接收。然后接收端实体对已成功收到的包发回一个相应的确认（ACK）；如果发送端实体在合理的往返时延（RTT）内未收到确认，那么对应的数据包就被假设为已丢失将会被进行重传。TCP用一个校验和函数来检验数据是否有错误；在发送和接收时都要计算校验和。

### JAVA Socket

所谓socket 通常也称作”套接字“，用于描述IP地址和端口，是一个通信链的句柄。应用程序通常通过”套接字”向网络发出请求或者应答网络请求。

Socket和ServerSocket类库位于java.net包中。ServerSocket用于服务器端，Socket是建立网络连接时使用的。在连接成功时，应用程序两端都会产生一个Socket实例，操作这个实例，完成所需的会话。对于一个网络连接来说，套接字是平等的，并没有差别，不因为在服务器端或在客户端而产生不同级别。不管是Socket还是ServerSocket它们的工作都是通过SocketImpl类及其子类完成的。

### 重要的Socket API

java.net.Socket继承于java.lang.Object，有八个构造器，其方法并不多，下面介绍使用最频繁的三个方法，其它方法大家可以见JDK-1.3文档。

Accept方法用于产生”阻塞”，直到接受到一个连接，并且返回一个客户端的Socket对象实例。”阻塞”是一个术语，它使程序运行暂时”停留”在这个地方，直到一个会话产生，然后程序继续；通常”阻塞”是由循环产生的。
getInputStream方法获得网络连接输入，同时返回一个InputStream对象实例。
getOutputStream方法连接的另一端将得到输入，同时返回一个OutputStream对象实例。
注意：其中getInputStream和getOutputStream方法均会产生一个IOException，它必须被捕获，因为它们返回的流对象，通常都会被另一个流对象使用。

## TCP编程

> socket通信时，都是必须先启动服务端，再启动客户端才能建立连接实现通信的

### 客户端实现

```java
package socket;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

/*
参考文章：https://www.codenong.com/cs106175296/
 */

/**
 * @author 030
 * @date 15:34 2021/11/8
 * @description TCP通信的客户端：向服务器发送连接请求，给服务器发送数据，读取服务器回写的数据
 * 表示客户端的类：
 * java.net.Socket：此类实现客户端套接字（也可以叫做“套接字”）。套接字是两台机器之间通信的端点。
 * 套接字：包含了IP地址和端口号的网络单位
 * 构造方法：
 * Socket(String host, int port) 创建一个流套接字并将其连接到指定主机上的指定端口号
 * 参数：
 * String host：服务器主机的名称/服务器的ip地址
 * int port：服务器的端口号
 * 成员方法：
 * OutputStream getOutputStream() 返回此套接字的输出流
 * InputStream getInputStream() 返回此套接字的输入流
 * void close() 关闭此套接字
 * <p>
 * 实现步骤：
 * 1. 创建一个客户端对象 Socket，构造方法绑定服务器的IP地址和端口号
 * 2. 使用 Socket 对象中的方法 getOutputStream() 获取网络字节输出流 OutputStream对象
 * 3. 使用网络字节输出流 OutputStream 对象中的方法 write，给服务器发送数据
 * 4. 使用 Socket 对象中的方法 getInputStream() 获取网络字节输入流 InputStream对象
 * 5. 使用网络字节输入流 InputStream对象中的方法 read，读取服务器返回的数据。
 * 6. 释放资源（Socket）
 * 注意：
 * 1. 客户端和服务器端进行交互，必须使用Socket中提供的网络流，不能使用自己创建的流对象
 * 2. 当我们创建客户端对象Socket的时候，就会去请求服务器，并与服务器经过3次握手建立链接通路
 * 这时如果服务器没有启动，那么就会抛出异常
 * 如果服务器已经启动，那么就可以进行交互了
 */
public class TCPClient {
    public static void main(String[] args) throws IOException {
        // 1. 创建一个客户端对象Socket，构造方法绑定服务器的IP地址和端口号
        Socket socket = new Socket("127.0.0.1", 8888);
        // 2. 使用Socket对象中的方法getOutputStream获取网络字节输出流OutputStream对象
        OutputStream os = socket.getOutputStream();
        // 3. 使用网络字节输出流OutputStream对象中的方法write，给服务器发送数据
        String message = "你好服务器，我是客户端";
        os.write(message.getBytes(StandardCharsets.UTF_8));

        /*********解决bug：服务端读取不到 len = -1 标识，会一直处在死循环等待状态ing**********/
        //通过shutdownOutput高速服务器已经发送完数据，后续只能接受数据
        socket.shutdownOutput();

        // 4. 使用Socket对象中的方法getInputStream获取网络字节输入流InputStream对象
        InputStream is = socket.getInputStream();
        int len; // 基本数据类型在方法内部（局部变量）时，可以省略初始化，会默认初始化的；但是作为成员变量时则不可以
        byte[] bytes = new byte[1024];
        // 用于记录 服务端回写 的数据
        StringBuilder sb = new StringBuilder(); // 注意：多线程时要使用 StringBuffer
        while ((len = is.read(bytes)) != -1) {
            // 5. 使用网络字节输入流InputStream对象中的方法read，读取服务器返回的数据。
            // 注意指定编码格式，发送方和接收方一定要统一，建议使用UTF-8
            sb.append(new String(bytes, 0, len, StandardCharsets.UTF_8));
        }
        // 打印输出一下服务端回写的数据
        System.out.println("get message from server: " + sb);
        // 6. 释放资源（Socket）
        is.close();
        os.close();
        socket.close();
    }
}
```

### 服务器端实现

```java
package socket;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

/*
参考文章：https://www.codenong.com/cs106175296/
 */

/**
 * @author 030
 * @date 20:10 2021/11/8
 * @description TCP通信的服务器端：接收客户端的请求，读取客户端发送的数据，给客户端回写数据
 * 表示服务器的类：
 * java.net.ServerSocket：此类实现服务器套接字
 * <p>
 * 构造方法：
 * ServerSocket(int port) 创建绑定到特定端口的服务器套接字
 * 服务器端必须明确一件事，必须得知道是哪个客户端请求的服务器
 * 所以可以使用 accept() 方法获取到请求的客户端对象 Socket
 * 成员方法：
 * Socket accept() 侦听并接受到此套接字的连接
 * 服务器的实现步骤：
 * 1. 创建服务器 ServerSocket 对象和系统要指定的端口号
 * 2. 使用 ServerSocket 对象中的方法 accept， 获取到请求的客户端对象 Socket
 * 3. 使用Socket对象中的方法 getInputStream() 获取网络字节输入流 InputStream对象
 * 4. 使用网络字节输入流 InputStream 对象中的方法 read，读取客户端发送的数据
 * 5. 使用 Socket 对象中的方法 getOutputStream() 获取网络字节输出流OutputStream对象
 * 6. 使用网络字节输出流 OutputStream 对象中的方法 write，给客户端回写数据
 * 7. 释放资源（Socket， ServerSocket）
 */
public class TCPServer {

    /*一定要先启动 服务端，再启动 客户端才能执行*/
    public static void main(String[] args) throws IOException {
        // 1. 创建服务器 ServerSocket 对象和系统要指定的端口号
        ServerSocket server = new ServerSocket(8888);
        // 2. 使用 ServerSocket 对象中的方法 accept， 获取到请求的客户端对象 Socket
        Socket socket = server.accept();
        // 3. 使用Socket对象中的方法 getInputStream() 获取网络字节输入流 InputStream对象
        InputStream is = socket.getInputStream();
        int len;
        byte[] bytes = new byte[1024];
        StringBuilder sb = new StringBuilder(); // 多线程下注意异常
        // 只有当客户端关闭它的输出流的时候，服务端才能取得结尾的-1
        while ((len = is.read(bytes)) != -1) {
            // 4. 使用网络字节输入流 InputStream 对象中的方法 read，读取客户端发送的数据
            // 注意指定编码格式，发送方和接收方一定要统一，建议使用UTF-8
            sb.append(new String(bytes, 0, len, StandardCharsets.UTF_8));
        }
        // 打印输出 客户端发送的消息
        System.out.println("get message from client: " + sb);

        // 5. 使用 Socket 对象中的方法 getOutputStream() 获取网络字节输出流OutputStream对象
        OutputStream os = socket.getOutputStream();
        // 6. 使用网络字节输出流 OutputStream 对象中的方法 write，给客户端回写数据
        os.write("Hello Client,I get the message...".getBytes(StandardCharsets.UTF_8));
        //  7. 释放资源（Socket， ServerSocket）
        is.close();
        os.close();
        socket.close();
        server.close();
    }
}
```

## 说明
### 如何告知服务端已经发送完信息
其实这个问题还是比较重要的，正常来说，客户端打开一个输出流，如果不做约定，也不关闭它，那么服务端永远不知道客户端是否发送完消息，那么服务端会一直等待下去，直到读取超时。所以怎么告知服务端已经发送完消息就显得特别重要。

#### 1、通过Socket关闭
可以在客户端发送完消息后，采取手动关闭Socket的方式，服务端就会收到相应的关闭信号，那么服务端也就知道`网络字节流`已经关闭了，这个时候读取操作完成，就可以继续后续的工作了。

> 但是这种方式有一些缺点：客户端Socket关闭后，将不能再接收服务端发送的消息，也不能再向服务端发送消息了。如果客户端想再次发送消息，需要重新创建Socket连接

#### 2、通过Socket关闭输出流的方式
这种方式就是上面客户端代码中采用的方式，在发送完消息后，直接调用 `socket.shutdownOutput()`方法，底层会告知服务端我这边已经写完了，那么服务端收到消息后，就能知道已经取完消息了，如果服务端有要返回给客户的消息，那么就可以通过服务端的输出流发送给客户端，如果没有，直接关闭Socket对象就可以了。

> 这种方式通过关闭客户端的输出流，告知服务端已经写完了，虽然可以读到服务端发送的消息，但是还是有一点点缺点：不能再次发送消息给服务端，如果再次发送，需要重新建立Socket连接。这个缺点，在访问频率比较高的情况下将是一个需要优化的地方。

#### 3、通过约定符号
这种方式的用法，就是双方约定一个字符或者一个短语，来当做消息发送完成的标识，通常这么做就需要改造读取方法。假如约定单端的一行为end，代表发送完成，例如下面的消息，end则代表消息发送完成：
    hello abc
end
那么服务端响应的读取操作需要进行如下改造：
```java
Socket socket = server.accept();
// 建立好连接后，从socket中获取输入流，并建立缓冲区进行读取
BufferedReader read=new BufferedReader(new InputStreamReader(socket.getInputStream(),“UTF-8”));
String line;
StringBuilder sb = new StringBuilder();
while ((line = read.readLine()) != null && “end”.equals(line)) {
    //注意指定编码格式，发送方和接收方一定要统一，建议使用UTF-8
    sb.append(line);
}
```
可以看见，服务端不仅判断是否读到了流的末尾，还判断了是否读到了约定的末尾。

> 这么做的优缺点如下：
> 优点：不需要关闭流，当发送完一条命令（消息）后可以再次发送新的命令（消息）
> 缺点：需要额外的约定结束标志，太简单的容易出现在要发送的消息中，误被结束，太复杂的不好处理，还占带宽。
> 经过了这么多的优化还是有缺点，难道就没有完美的解决方案吗，答案是有的，看接下来的内容。

#### 4、通过指定长度
如果你了解一点class文件的结构（后续会写，敬请期待），那么你就会佩服这么设计方式，也就是说我们可以在此找灵感，就是我们可以先指定后续命令的长度，然后读取指定长度的内容做为客户端发送的消息。

如果你了解一点class文件的结构（后续会写，敬请期待），那么你就会佩服这么设计方式，也就是说我们可以在此找灵感，就是我们可以先指定后续命令的长度，然后读取指定长度的内容做为客户端发送的消息。
> 现在首要的问题就是用几个字节指定长度呢，我们可以算一算：
> 1个字节：最大256，表示256B
> 2个字节：最大65536，表示64K
> 3个字节：最大16777216，表示16M
> 4个字节：最大4294967296，表示4G

依次类推，这个时候是不是很纠结，最大的当然是最保险的，但是真的有必要选择最大的吗，其实如果你稍微了解一点UTF-8的编码方式（字符编码后续会写，敬请期待），那么你就应该能想到为什么一定要固定表示长度字节的长度呢，我们可以使用变长方式来表示长度的表示，比如：第一个字节首位为0：即0XXXXXXX，表示长度就一个字节，最大128，表示128B
第一个字节首位为110，那么附带后面一个字节表示长度：即110XXXXX 10XXXXXX，最大2048，表示2K
第一个字节首位为1110，那么附带后面二个字节表示长度：即110XXXXX 10XXXXXX 10XXXXXX，最大131072，表示128K。
依次类推，上面提到的这种用法适合高富帅的程序员使用，一般呢，如果用作命名发送，两个字节就够了，如果还不放心4个字节基本就能满足你的所有要求，下面的例子我们将采用2个字节表示长度，目的只是给你一种思路，让你知道有这种方式来获取消息的结尾。

##### 服务端
```java
package socket.type04;

import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

/**
 * @author 030
 * @date 0:51 2021/11/9
 * @description
 * 如何告知服务端已经发送完信息
 *  实现方式第四种：4、通过指定长度
 */
public class SocketServer {

    public static void main(String[] args) throws Exception {
        // 监听指定的端口
        int port = 55533;
        ServerSocket server = new ServerSocket(port);
        // server将一直等待连接的到来
        System.out.println("server将一直等待连接的到来");
        Socket socket = server.accept();
        // 建立好连接后，从socket中获取输入流，并建立缓冲区进行读取
        InputStream is = socket.getInputStream();
        byte[] bytes;
        // 因为可以复用Socket且能判断长度，所以可以一个Socket用到底
        while (true) {
            // 首先读取两个字节表示的长度
            int first = is.read();
            //如果读取的值为-1 说明到了流的末尾，Socket已经被关闭了，此时将不能再去读取
            if (first == -1) {
                break;
            }
            int second = is.read();
            int length = (first << 8) + second;
            // 然后构造一个指定长的byte数组
            bytes = new byte[length];
            // 然后读取指定长度的消息即可
            is.read(bytes);
            System.out.println("get message from client: " + new String(bytes, StandardCharsets.UTF_8));
        }
        is.close();
        socket.close();
        server.close();
    }
}
```

##### 客户端
```java
package socket.type04;

import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

/**
 * @author 030
 * @date 0:52 2021/11/9
 * @description
 * 如何告知服务端已经发送完信息
 *  实现方式第四种：4、通过指定长度
 */
public class SocketClient {

    public static void main(String args[]) throws Exception {
        // 要连接的服务端IP地址和端口
        String host = "127.0.0.1";
        int port = 55533;
        // 与服务端建立连接
        Socket socket = new Socket(host, port);
        // 建立连接后获得输出流
        OutputStream os = socket.getOutputStream();
        String message = "你好服务端";
        //首先需要计算得知消息的长度
        byte[] sendBytes = message.getBytes(StandardCharsets.UTF_8);
        //然后将消息的长度优先发送出去
        os.write(sendBytes.length >> 8);
        os.write(sendBytes.length);
        //然后将消息再次发送出去
        os.write(sendBytes);
        os.flush();
        //==========此处重复发送一次，实际项目中为多个命名，此处只为展示用法
        message = "第二条消息|";
        sendBytes = message.getBytes(StandardCharsets.UTF_8);
        os.write(sendBytes.length >> 8);
        os.write(sendBytes.length);
        os.write(sendBytes);
        os.flush();
        //==========此处重复发送一次，实际项目中为多个命名，此处只为展示用法
        message = "the third message !";
        sendBytes = message.getBytes("UTF-8");
        os.write(sendBytes.length >> 8);
        os.write(sendBytes.length);
        os.write(sendBytes);

        os.close();
        socket.close();
    }
}
```
> 客户端要多做的是，在发送消息之前先把消息的长度发送过去。这种事先约定好长度的做法解决了之前提到的种种问题，`Redis`的Java客户端`Jedis`就是用这种方式实现的。当然如果是需要服务器返回结果，那么也依然使用这种方式。服务端也是先发送结果的长度，然后客户端进行读取。当然现在流行的是，长度+类型+数据模式的传输方式。


> 本节内容参考于[码农家园](https://www.codenong.com/cs106175296/)，在此致谢~~~
> 本节示例[代码仓库](https://github.com/hello-github-ui/java_base/tree/master/net/src/main/java/socket/%E5%9F%BA%E7%A1%80%E6%A8%A1%E5%BC%8F)
