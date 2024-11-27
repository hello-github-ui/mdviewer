# java共支持三种网络编程模式：BIO，NIO，AIO

## 三种IO模式适用场景

* BIO方式适用于连接数目比较小且固定的架构，这种方式对服务器资源要求比较高，并发有局限性，JDK1.4以前是唯一的选择，好处是编码实现方式简单，且也容易理解。
* NIO方式适用于连接数目多且连接比较段的架构，比如聊天服务器，弹幕系统等，相比BIO编码较复杂，JDK1.4以后开始支持。
* AIO方式适用于连接数据多且连接较长的场景，比如相册服务器等，编程较复杂，JDK1.7才开始支持。目前好像并为得到广泛使用。

# BIO(blocking I/O) 基本介绍

Java BIO是传统的Java io编程，相关的类和接口在java.io包中
Java BIO：同步阻塞，一个连接为一个线程，连接一个客户端就需要启动一个线程进行处理，如果连接未断开且未做任何事，会造会不必要的开销。可以通过线程池优化。
Java BIO：适用于连接数目较小且相对固定的架构，对服务器的要求比较高，对并发有局限性。JDK1.4以前唯一的选择，简单易理解。

## BIO的原理示意图

![](https://pic.imgdb.cn/item/60d18fae844ef46bb2c1c3b9.jpg)

## 流程

<ol>
<li>服务器启动ServerSoket。</li>
<li>客户端启动Socket与服务器通信，默认情况下服务器需要对每个客户端建立一个线程与之通信。</li>
<li>客户端发出请求与服务器通信。</li>
<li>如果请求成功，客户端会等待请求结束后继续执行。</li>
</ol>

## Java BIO应用实例

实例要求：

使用NIO编写服务端，监听8888端口号，当有客户端连接时，启动一个线程与之通信。
使用线程池改进，可以连接多个客户端。

**服务端**

```java
package com.crazy.io.bio;

import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class BIOServer {

    public static void main(String[] args) throws IOException {
        /**
         * 1.创建一个线程池
         * 如果有客户端连接了，就创建一个线程与之通信。
         */
        ExecutorService newCachedThreadPool = Executors.newCachedThreadPool();

        // 创建ServerSocket
        ServerSocket serverSocket = new ServerSocket(6668);

        System.out.println("服务器启动了");

        while (true) {
            // 监听，等待客户端连接
            final Socket socket = serverSocket.accept();
            System.out.println("连接到了一个客户端");
            newCachedThreadPool.execute(new Runnable() {
                @Override
                public void run() {
                    // 可以和客户端通讯
                    handler(socket);
                }
            });
        }

    }

    // 编写一个handler方法，与客户端通讯
    public static void handler(Socket socket) {
        // 通过socket获取输入流
        try {
            System.out.println("线程信息 id=" + Thread.currentThread().getId() + "线程名字=" + Thread.currentThread().getName());
            InputStream inputStream = socket.getInputStream();
            byte[] bytes = new byte[1024];

            // 循环的读取客户端发送的数据
            while (true) {
                System.out.println("线程信息 id=" + Thread.currentThread().getId() + "线程名字=" + Thread.currentThread().getName());

                int read = inputStream.read(bytes);
                if (read != -1) {
                    // 输出客户端发送的数据
                    System.out.println(new String(bytes, 0, read));
                } else {
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 关闭和客户端的连接
            try {
                socket.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

```

**客户端**

```java
package com.crazy.io.zerocopy;

import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.Socket;

public class OldIOClient {

    public static void main(String[] args) throws Exception {
        Socket socket = new Socket("localhost", 6668);

        String fileName = "1.txt";
        InputStream inputStream = new FileInputStream(fileName);

        DataOutputStream dataOutputStream = new DataOutputStream(socket.getOutputStream());

        byte[] buffer = new byte[4096];
        long readCount;
        long total = 0;

        long startTime = System.currentTimeMillis();

        while ((readCount = inputStream.read(buffer)) >= 0) {
            total += readCount;
            dataOutputStream.write(buffer);
        }
        System.out.println("发送总字节数： " + total + ", 耗时： " + (System.currentTimeMillis() - startTime));
        dataOutputStream.close();
        socket.close();
        inputStream.close();
    }
}
```

有小伙伴说，我就只想写服务器，不想写客户端，能不能测试。能，我都给你们准备好了。可以使用windows的命令行telnet命令来测试。
`telnet 127.0.0.1 6668`
连接成功后通过按 Ctrl+] 符号进入发送数据界面
![](https://pic.imgdb.cn/item/60d190a4844ef46bb2c90661.jpg)
`send hello world`
![](https://pic.imgdb.cn/item/60d190cf844ef46bb2ca5faf.jpg)
查看服务端收到的消息
![](https://pic.imgdb.cn/item/60d190e3844ef46bb2caf4a0.jpg)
完成了简单的以BIO实现的客户端与服务器之间的交互。

## Java BIO问题

每个请求都需要创建独立的线程。
当并发量大时，需要创建大量线程，占用系统资源。
连接建立后，如果当前线程暂时没有数据可读，则线程就阻塞在 Read 操作上，造成线程资源浪费

# Java NIO( java non-blocking IO) 基本介绍

Java NIO全称（java non-blocking io），从 JDK1.4 开始，Java 提供了一系列改进的输入/输出的新特性，被统称为 NIO(即 New IO)
，是同步非阻塞的。
NIO 相关类都被放在 java.nio 包及子包下，并且对原 java.io 包中的很多类进行了改写。
NIO 有三大核心部分：Channel(通道)，Buffer(缓冲区), Selector(选择器) 。
NIO是 面向缓冲区。数据读取到一个它稍后处理的缓冲区中，需要时可在缓冲区中前后移动，这就增加了处理过程中的灵活性，使用它可以提供非阻塞式的高伸缩性网络。
Java NIO的非阻塞模式，使一个线程从某通道发送请求或者读取数据，但是它仅能得到目前可用的数据，如果目前没有数据可用，就什么都不获取，会继续保持线程阻塞，直至数据变的可以读取之前，该线程可以继续做其他的事情。
非阻塞写也是如此，一个线程请求写入一些数据到某通道，但不需要等待它完全写入，这个线程同时可以去做别的事情。
通俗理解：NIO是可以做到用一个线程来处理多个操作。假设有500个请求过来,根据实际情况，可以分配50或者100个线程来处理。而BIO可能需要创建500个线程来处理数据。
NIO的并发请求要远远大于BIO。

## Selector 、 Channel 和 Buffer 的关系图

![](https://pic.imgdb.cn/item/60d1911a844ef46bb2cca445.jpg)

## 关系图说明

每个channel 都会对应一个Buffer。
Selector 对应一个线程， 一个线程对应多个channel(连接)。
该图反应了有三个channel 注册到 该selector 程序。
程序切换到哪个channel 是有事件决定的, Event 就是一个重要的概念。
Selector 会根据不同的事件，在各个通道上切换。
Buffer 就是一个内存块 ， 底层是有一个数组。
数据的读取写入是通过Buffer, 这个和BIO , BIO 中要么是输入流，或者是输出流, 不能双向，但是 NIO的Buffer 是可以读也可以写, 需要
flip 方法切换。
channel 是双向的, 可以返回底层操作系统的情况, 比如Linux ， 底层的操作系统通道就是双向的。

## 什么是缓冲区（Buffer）?

缓冲区本质上是一个可以读写数据的内存块，可以理解成是一个容器对象(含数组)
，该对象提供了一组方法，可以更轻松地使用内存块，缓冲区对象内置了一些机制，能够跟踪和记录缓冲区的状态变化情况。Channel
提供从文件、网络读取数据的渠道，但是读取或写入的数据都必须经由 Buffer。
![](https://pic.imgdb.cn/item/60d19145844ef46bb2cdef1c.jpg)

## Buffer常用方法解析

![](https://pic.imgdb.cn/item/60d1917a844ef46bb2cf9fd7.jpg)
常用的ByteBuffer是一个抽象类，继承Buffer，实现了Comparable接口。
![](https://pic.imgdb.cn/item/60d1918b844ef46bb2d02240.jpg)
mark：标记。
Position：位置，下一个要被读或写的元素的索引，每次读写缓冲区数据时都会改变改值，为下次读写作准备。
Limit：表示缓冲区的当前终点，不能对缓冲区超过极限的位置进行读写操作。且极限是可以修改的。
Capacity：容量，即可以容纳的最大数据量；在缓冲区创建时被设定并且不能改变。

ByteBuffer中常用的方法：

```java
// 缓冲区创建相关api
    public static ByteBuffer allocateDirect(int capacity)//创建直接缓冲区
    public static ByteBuffer allocate(int capacity)//设置缓冲区的初始容量
    public static ByteBuffer wrap(byte[] array)//把一个数组放到缓冲区中使用
    //构造初始化位置offset和上界length的缓冲区
    public static ByteBuffer wrap(byte[] array,int offset, int length)
     //缓存区存取相关API
    public abstract byte get( );//从当前位置position上get，get之后，position会自动+1
    public abstract byte get (int index);//从绝对位置get
    public abstract ByteBuffer put (byte b);//从当前位置上添加，put之后，position会自动+1
    public abstract ByteBuffer put (int index, byte b);//从绝对位置上put
```

## 通道基本介绍

通道可以同时进行读写，而流只能读或者只能写。
通道可以实现异步读写数据。
通道可以从缓冲读数据，也可以写数据到缓冲。
![](https://pic.imgdb.cn/item/60d191bc844ef46bb2d1c432.jpg)

## 通道说明

![](https://pic.imgdb.cn/item/60d191ce844ef46bb2d2655d.jpg)
Channel是一个接口。

常用的 Channel 类有：FileChannel、DatagramChannel、ServerSocketChannel 和 SocketChannel。
ServerSocketChanne 类似 ServerSocket 。
SocketChannel 类似 Socket。

## 应用实例

实例要求:

把1.txt中的文件读取到2.txt中。

```java
public class NIOFileChannel03 {
    public static void main(String[] args) throws IOException {
        FileInputStream fileInputStream = new FileInputStream("1.txt");
        FileChannel inputStreamChannel = fileInputStream.getChannel();
        FileOutputStream fileOutputStream = new FileOutputStream("2.txt");
        FileChannel outputStreamChannel = fileOutputStream.getChannel();

        ByteBuffer byteBuffer = ByteBuffer.allocate(10);
        while (true) {
            byteBuffer.clear();
            int read = inputStreamChannel.read(byteBuffer);
            System.out.println("read =" + read);
            if (read == -1) {
                break;
            }
            byteBuffer.flip();

            outputStreamChannel.write(byteBuffer);
        }
        fileInputStream.close();
        inputStreamChannel.close();
        outputStreamChannel.close();
        fileOutputStream.close();

    }
}
```

## Buffer和Channel的注意事项

ByteBuffer 支持类型化的put 和 get, put 放入的是什么数据类型，get就应该使用相应的数据类型来取出，否则可能有
BufferUnderflowException 异常。
可以将一个普通Buffer 转成只读Buffer。
NIO 还提供了 MappedByteBuffer， 可以让文件直接在内存（堆外的内存）中进行修改， 而如何同步到文件由NIO 来完成。

## Selector(选择器)

Java 的 NIO，用非阻塞的 IO 方式。可以用一个线程，处理多个的客户端连接，就会使用到Selector(选择器)。
Selector 能够检测多个注册的通道上是否有事件发生，如果有事件发生，便获取事件然后针对每个事件进行相应的处理。这样就可以只用一个单线程去管理多个通道，也就是管理多个连接和请求。
只有在 连接/通道 真正有读写事件发生时，才会进行读写，就大大地减少了系统开销，并且不必为每个连接都创建一个线程，不用去维护多个线程。
避免了多线程之间的上下文切换导致的开销。

## Selector的示意图

![](https://pic.imgdb.cn/item/60d19238844ef46bb2d5f956.jpg)
线程从某客户端 Socket 通道进行读写数据时，若没有数据可用时，该线程可以进行其他任务。
线程通常将非阻塞 IO 的空闲时间用于在其他通道上执行 IO 操作，所以单独的线程可以管理多个输入和输出通道。
由于读写操作都是非阻塞的，这就可以充分提升 IO 线程的运行效率，避免由于频繁 I/O 阻塞导致的线程挂起。
一个 I/O 线程可以并发处理 多个客户端连接和读写操作，这从根本上解决了传统同步阻塞 I/O
一个连接一个线程模型，架构的性能、弹性伸缩能力和可靠性都得到了极大的提升。

## NIO 非阻塞网络编程原理图

![](https://pic.imgdb.cn/item/60d19254844ef46bb2d6e8c5.jpg)
客户端连接时，会通过ServerSocketChannel 得到 SocketChannel
Selector 进行监听 select 方法, 返回有事件发生的通道的个数。
将socketChannel注册到Selector上, register(Selector sel, int ops), 一个selector上可以注册多个SocketChannel。
注册后返回一个 SelectionKey, 会和该Selector 关联(集合)
进一步得到各个 SelectionKey。
在通过 SelectionKey 反向获取 SocketChannel , 方法 channel()
可以通过 得到的 channel , 完成业务处理。

## 应用案例

编写一个 NIO 入门案例，实现服务器端和客户端之间的数据简单通讯（非阻塞）。

**服务器端**

```java
package com.crazy.io.nio.buffer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;

public class NIOServer {

    public static void main(String[] args) throws IOException {
        // 创建serverSocketChannel
        ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
        // 创建selector
        Selector selector = Selector.open();
        // 绑定一个端口6666.在服务器监听
        serverSocketChannel.socket().bind(new InetSocketAddress(6666));
        // 设置为非阻塞
        serverSocketChannel.configureBlocking(false);
        // 把serverSocketChannel注册到selector 关心事件为OP_ACCEPT
        serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);

        // 循环等待客户端连接
        while (true) {
            // 一秒没有事件发生，没有事件发生
            if (selector.select(1000) == 0) {
                System.out.println("等待了一秒，无连接");
                continue;
            }
            // 如果返回的大于0,拿到selectionkey集合
            // 如果大于0，表示已回去到关注的事件
            // 通过selectionkeys反向获取通道
            Set<SelectionKey> selectionKeys = selector.selectedKeys();
            Iterator<SelectionKey> keyIterator = selectionKeys.iterator();
            while (keyIterator.hasNext()) {
                SelectionKey key = keyIterator.next();
                // 根据key对应的通道发生的事件做相应处理
                // 有新的客户端来连接了
                if (key.isAcceptable()) {
                    SocketChannel socketChannel = serverSocketChannel.accept();

                    // 将socketChannel设置为非阻塞
                    socketChannel.configureBlocking(false);
                    System.out.println("客户端连接成功======");
                    // 注册到selector上, 关注事件为读，给socketChannel关联一个Buffer
                    socketChannel.register(selector, SelectionKey.OP_READ, ByteBuffer.allocate(1024));
                }
                if (key.isReadable()) {
                    // 通过key 反向获取对应的channel
                    SocketChannel channel = (SocketChannel) key.channel();
                    // 获取到管理的Buffer
                    ByteBuffer buffer = (ByteBuffer) key.attachment();
                    channel.read(buffer);
                    System.out.println("form客户端" + new String(buffer.array()));
                }
                keyIterator.remove();
            }
        }
    }
}

```

**客户端**

```java
package com.crazy.io.nio.buffer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;


public class NIOClient {

    public static void main(String[] args) throws IOException {
        // 等到通道
        SocketChannel socketChannel = SocketChannel.open();
        // 设置非阻塞
        socketChannel.configureBlocking(false);
        InetSocketAddress inetSocketAddress = new InetSocketAddress("127.0.0.1", 6666);
        // 连接服务器
        if (!socketChannel.connect(inetSocketAddress)) {
            while (!socketChannel.finishConnect()) {
                System.out.println("没有连接上，可以做其它事情");
            }
        }
        // 连接成功
        String hello = "失忆老幺";
        ByteBuffer buffer = ByteBuffer.wrap(hello.getBytes());
        // 发送数据,将buffer数据写到channel
        socketChannel.write(buffer);
        System.in.read();
    }
}
```

# AIO

# 总结

![](https://pic.imgdb.cn/item/60d192da844ef46bb2db4035.jpg)

*以上内容参考自[失忆老幺](https://blog.csdn.net/qq_42216791/article/details/107316926)*
