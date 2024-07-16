
## 前言
前些时候，我在某个网站上注册了一个账号，在修改个人头像时，发现该网站仅支持矩形头像的显示，但是我个人是比较喜欢圆形头像的；
因此我需要将电脑上一张矩形图片处理成白底圆形的图片，但是我找了好多在线方法（ps：不太喜欢给电脑上下载许多不常用的工具），发现
都不太好用，于是决定看能否用代码来实现这个需求，因此有了本文。

## 构思
在Java语言中，其实有一个操作图像的类库，就是 `BufferedImage`。
Image 是一个抽象类，BufferedImage 是 Image 的实现类，是一个操作缓冲区图像的类。BufferedImage 的主要作用是将一张图片加载到内存中，
然后我们就可以实现对图像的一些操作。比如：获得绘图对象、图像缩放、选择图像平滑度、图片大小变换、改变图片显示颜色、设置透明度等功能。

## 实现

```java

package com.abc.learn;

import org.apache.commons.io.FilenameUtils;
import org.junit.Test;
import sun.misc.BASE64Encoder;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.Ellipse2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

/**
 * @author 030
 * @date 13:05 2021/9/24
 * @description
 */
public class ToCirclePicture {

    // 本地图片示例
    private static final String localImgPath = "C:/Users/Administrator/Pictures/4K/312591.jpg";

    // 网络图片以我图床上的一张图为例
    private static final String netImgUrl = "https://pic.imgdb.cn/item/613e1f7c44eaada739eb4a11.jpg";


    /**
     * 传入的图像必须是正方形的 才会 变成圆形
     * 如果是长方形的比例则会变成椭圆的
     */
    public static BufferedImage changeToCircular(BufferedImage bufferedImage, int radius) {
        // 这种是黑色底的
//      BufferedImage destImg = new BufferedImage(radius, radius, BufferedImage.TYPE_INT_RGB);

        // 透明底的图片，长、宽都为 既定的半径
        BufferedImage destImg = new BufferedImage(radius, radius, BufferedImage.TYPE_4BYTE_ABGR);
        Ellipse2D.Double shape = new Ellipse2D.Double(0, 0, radius, radius);
        Graphics2D g2 = destImg.createGraphics();
        g2.setClip(shape);
        // 使用 setRenderingHint 设置抗锯齿
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.drawImage(bufferedImage, 0, 0, null);
        // 设置颜色
        g2.setBackground(Color.white);
        g2.dispose();
        return destImg;
    }


    /**
     * 缩小Image，此方法返回源图像按给定宽度、高度限制下缩放后的图像
     *
     * @param sourceImage
     * @param newWidth    ：压缩后宽度
     * @param newHeight   ：压缩后高度
     */
    public static BufferedImage scaleByPercentage(BufferedImage sourceImage, int newWidth, int newHeight) {
        // 获取原始图像透明度类型
        int type = sourceImage.getColorModel().getTransparency();
        int width = sourceImage.getWidth();
        int height = sourceImage.getHeight();
        // 开启抗锯齿
        RenderingHints renderingHints = new RenderingHints(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        // 使用高质量压缩
        renderingHints.put(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        BufferedImage img = new BufferedImage(newWidth, newHeight, type);
        Graphics2D graphics2d = img.createGraphics();
        // graphics2d.setRenderingHints(renderingHints);
        graphics2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        graphics2d.drawImage(sourceImage, 0, 0, newWidth, newHeight, 0, 0, width, height, null);
        graphics2d.dispose();
        return img;
    }


    /**
     * 获取字符串的base64编码
     */
    public static String getBase64(String str) {

        String destStr = "";
        try {
            byte[] sourceArray = str.getBytes(StandardCharsets.UTF_8);
            // 对 byte[] 进行base64编码
            destStr = new BASE64Encoder().encode(sourceArray);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return destStr;
    }


    /**
     * 测试 base64 编码
     */
    @Test
    public void testBase64() {
        String oldStr = "hello java";
        String newStr = getBase64(oldStr);
        System.out.println(newStr); // aGVsbG8gamF2YQ==
    }


    /**
     * 测试 传入的是一个本地硬盘图片时，裁剪尺寸成矩形
     */
    @Test
    public void testLocalImg() {
        try {
            // BufferedImage是一个Image的实现类，主要作用是将一幅图片加载到内存中（BufferedImage生成的图片在内存里有一个图像缓冲区，利用这个缓冲区可以方便地操作这个图片）
            // java 中将一副本地图片加载到内存的方式
            // ImageIO 提供read()和write()静态方法，读写图片，比以往的InputStream读写更方便
            BufferedImage sourceImg = ImageIO.read(new FileInputStream(localImgPath)); // 当然你这里使用File实例构造也是可以的
            // 拿到 BufferedImage 实例之后，我们就可以对图片进行各种操作了，比如获得绘图对象、图像缩放、选择图像平滑度等功能，通常用来做图片大小变换、图片变灰、设置透明不透明等
            // 将原始图片，处理成既定大小的矩形图片
            BufferedImage destImg = scaleByPercentage(sourceImg, sourceImg.getWidth(), sourceImg.getHeight());
            File outputFile = new File(FilenameUtils.getBaseName(localImgPath) + "-副本-" + Instant.now().toEpochMilli() + ".png");
            // 传输中，图片是不能直接传的，需要先转为字节数组再传输较为方便；而字节数组再转回BufferedImage则还原图片  BufferedImage–>byte[]
            ImageIO.write(destImg, "png", outputFile);
            System.out.println("转换图片完成");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 测试 当传入的是网络图片地址时，裁剪图像成矩形
     */
    @Test
    public void testNetUrlImg() {
        try {
            // BufferedImage是一个Image的实现类，主要作用是将一幅图片加载到内存中（BufferedImage生成的图片在内存里有一个图像缓冲区，利用这个缓冲区可以方便地操作这个图片）
            // java 中将一个网络图片加载到内存的方式
            // ImageIO 提供read()和write()静态方法，读写图片，比以往的InputStream读写更方便
            BufferedImage sourceImg = ImageIO.read(new URL(netImgUrl));
            // 拿到 BufferedImage 实例之后，我们就可以对图片进行各种操作了，比如获得绘图对象、图像缩放、选择图像平滑度等功能，通常用来做图片大小变换、图片变灰、设置透明不透明等
            // 将原始图片，处理成既定大小的矩形图片
            BufferedImage destImg = scaleByPercentage(sourceImg, sourceImg.getWidth(), sourceImg.getHeight());
            // 获取网络图片的名字
            String name = FilenameUtils.getBaseName(netImgUrl);
            File outputFile = new File(name + "-副本-" + Instant.now().toEpochMilli() + ".png");
            // 传输中，图片是不能直接传的，需要先转为字节数组再传输较为方便；而字节数组再转回BufferedImage则还原图片  BufferedImage–>byte[]
            ImageIO.write(destImg, "png", outputFile);
            System.out.println("转换图片完成");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 将本地图片裁剪成圆形
     */
    @Test
    public void testLocalImgToCircular() {
        try {
            // BufferedImage是一个Image的实现类，主要作用是将一幅图片加载到内存中（BufferedImage生成的图片在内存里有一个图像缓冲区，利用这个缓冲区可以方便地操作这个图片）
            // java 中将一个网络图片加载到内存的方式
            // ImageIO 提供read()和write()静态方法，读写图片，比以往的InputStream读写更方便
            BufferedImage sourceImg = ImageIO.read(new File(localImgPath));
            // 拿到 BufferedImage 实例之后，我们就可以对图片进行各种操作了，比如获得绘图对象、图像缩放、选择图像平滑度等功能，通常用来做图片大小变换、图片变灰、设置透明不透明等
            // 将原始图片，处理成 圆形，注意：需要按照矩形的短边裁剪
            BufferedImage destImg = changeToCircular(sourceImg, sourceImg.getHeight()); // 圆形的半径，就按照原始图片的高度来设置
            // 将 BufferedImage 缓冲区图像，输出保存
            /**
             * 注意：这里有一个很无语的点就是：不管原图片是什么格式的，你最后输出保存的文件格式必须是png的，如果你使用jpg格式后，就会发现图片编程暗粉色的了，
             * 这个bug我找了好久，不明白是什么原因，只能先这样了。
             */
            File outputFile = new File(FilenameUtils.getBaseName(localImgPath) + "-副本-圆形" + Instant.now().toEpochMilli() + ".png");
            ImageIO.write(destImg, "png", outputFile);

            System.out.println("图片已裁剪成圆形");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 测试 commons-io 中的 FilenameUtils 对文件的操作
     */
    @Test
    public void testUtils() {
        // 如果 字符串 是 路径字符串时，才可用如下方式
        // 获取文件名字，包含后缀
        String str = FilenameUtils.getName(localImgPath);
        // 获取文件名字，不包含后缀
        String baseName = FilenameUtils.getBaseName(localImgPath);
        System.out.println(str);
        System.out.println(baseName);
    }


    /**
     * 测试 jdk1.8 中 关于时间的工具类
     */
    @Test
    public void testNewTime() {
        Instant instant = Instant.now();
        // 获取秒 1632641950
        System.out.println(instant.getEpochSecond());
        // 获取毫秒 1632641950389
        System.out.println(instant.toEpochMilli());
        // 获取纳秒 389000000
        System.out.println(instant.getNano());
    }

}

```



<hr/>

**特别注意上面的裁剪成圆形图像的方法，最后输出的文件格式要是png的才可以，至于原因我暂时不清楚。**
<br/>
***文章参考：https://blog.csdn.net/jiachunchun/article/details/89670721***

