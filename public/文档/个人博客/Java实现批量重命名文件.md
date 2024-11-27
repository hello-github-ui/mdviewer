## 前言

有时候，我们需要对一个目录下的所有图片都进行重命名，如果你选择手动方式进行，在图片少的情况下还可以进行，但是如果一个目录下有几百张图片时，你就会感到无比痛苦了。这时候就会想借助工具来实现了。如下就是一种很简单的实现方式。

## 实现

可以选择直接下载这个jar包工具，然后通过 `java -jar xxx.jar` 的方式运行，也可以直接看其源代码然后拷贝其rename方法运行即可。

代码已托管在[gitee](https://gitee.com/hello-gitee-ui/batch-rename-picture.git)上，请移步查看。

![](https://img.imgdb.cn/item/6055ea01524f85ce29e10a4f.jpg)

## 流操作之下载图片

```java
@Test
public void downloadImg() throws Exception{
  String urlStr = "https://images7.alphacoders.com/118/1180526.jpg";
  // 构造 java.net.URL 网络请求对象
  URL url = new URL(urlStr);
  // 通过 url 打开一个 HttpURLConnection 连接
  HttpURLConnection connection = url.openConnection();
  // 从打开的连接中，获取响应流
  InputStream is = connection.getInputStream();
  // 准备获取流中的数据，并且将其写入到文件中
  File file = new File("e:/temp-files/1.png");
  // 构造输出流，输出到哪里呢？传入目标文件参数
  FileOutputStream fos = new FileOutputStream(file);
  // 只要涉及到 流的操作，必用 缓冲buffer
  byte[] buffer = new byte[1024];
  // 每次读取的长度
  int len = 0;
  while((len = is.read(buffer)) != -1){
    // 读取到的内容写入流中
    fos.write(buffer, 0, len);
  }
  // 关闭流
  fos.close();
  is.close();
  System.out.println("download completed");
}
```

## 流操作之复制图片

```java
@Test
public void copyImg() throws Exception{
  // 要复制的图片地址
  String imgPath = "e:/temp-files/1.png";
  FileInputStream is = new FileInputStream(imgPath);
  // 准备获取流中的数据，并且将其写入到文件中
  File file = new File("e:/temp-files/1-bak.png");
  // 构造输出流，输出到哪里呢？传入目标文件参数
  FileOutputStream fos = new FileOutputStream(file);
  // 只要涉及到 流的操作，必用 缓冲buffer
  byte[] buffer = new byte[1024];
  // 每次读取的长度
  int len = 0;
  while((len = is.read(buffer)) != -1){
    // 读取到的内容写入流中
    fos.write(buffer, 0, len);
  }
  // 关闭流
  fos.close();
  is.close();
  System.out.println("copy img completed");
}
```

## 流操作之复制txt

```java
 @Test
    public void copyTxt() throws Exception{
        // urlPath
        String filePath = "e:/temp-files/1.txt";
        // inputStream
        FileInputStream fis = new FileInputStream(filePath);
        //
        File file = new File("e:/temp-files/1-bak.txt");
        FileOutputStream fos = new FileOutputStream(file);
        byte[] buffer = new byte[1024];
        int len = 0;
        while ((len = fis.read(buffer)) != -1){
            fos.write(buffer, 0, len);
        }
        fos.close();
        fis.close();
        System.out.println("txt copy completed");
    }
```

## 通过工具图片API获取图片

````java
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

/**
     * 随机图片 url，不一定可用
     * 通过 GET 方式，获取 JSON 响应中的 imgUrl 图片url地址
     */
    public static String getImg() {
        String str = "";
        try {
            String urlStr = "https://www.dmoe.cc/random.php?return=json";
            CloseableHttpClient httpClient = HttpClientBuilder.create().build();
            HttpGet httpGet = new HttpGet(urlStr);
            //获取请求响应值
            CloseableHttpResponse response = httpClient.execute(httpGet);
            //将请求响应值转换为String类型
            String responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            //将String类型转换为json对象
            JSONObject responseJson = JSON.parseObject(responseString);
            //获取对应的value值
            System.out.println(responseJson);
            str = responseJson.get("imgurl").toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return str;
    }
````

