# <font color=#FF8C00>java IO 操作分析</font>

直接看代码吧

```Java
package jdk.util.sourceCode;


import java.io.*;

/**
 * 经常会遇到各种 IO 流操作，IO 流操作一般分为两类：字符流和字节流。
 * 以 "Reader" 结尾都是字符流，操作的都是字符型的数据
 * 以 "Stream" 结尾的都是字节流，操作的都是 byte 类型的数据
 * 二者的区别：
 *  字节流没有缓冲区，是直接输出的；而字符流是先输出到缓冲区，然后在调用 close() 方法后再输出信息
 *  处理对象不同，字节流能处理所有类型的数据，但是字符流只能处理字符类型的数据（只要是处理纯文本数据，就优先考虑使用字符流，除此之外都使用字节流）
 * java byte -> short -> int -> long    1byte -> 2byte -> 4byte -> 8byte
 *
 *
 *
 * InputStream 和 OutputStream 是各种输入输出字节流的基类，所有字节流都继承于这两个基类
 *
 *
 * FileInputStream 和 FileOutputStream 这两个从字面意思很容易理解，是对文件的字节流操作，也是最常见的 IO 操作流
 *
 *
 * 非流式文件类 -- File 类
 *  从定义来看，File 类是 Object 的直接子类，同时它继承了 Comparable 接口可以进行数组的排序
 *  File 类的操作包括文件的创建，删除，重命名，得到文件/文件夹的路径，创建时间等
 *  File 类是对文件系统中文件以及文件夹进行封装的一个对象，可以通过对象的思想来操作文件和文件夹
 *
 /



/**
 * @author: util.you.com@gmail.com
 * @date: 2019/5/25 15:40
 * @description:
 * @version: 1.0
 * @className: TestIO
 */
public class TestIO {


    public static void  main(String[] args){
        // 1.调用 新建文件
//        createFile("F:\\github\\util.you.com@gmail.com\\jdk\\src\\main\\java\\jdk\\util\\sourceCode\\", "测试io.txt");

        // 2.调用删除文件
//        deleteFile("F:\\github\\util.you.com@gmail.com\\jdk\\src\\main\\java\\jdk\\util\\sourceCode\\","测试io.txt");


        // 3.调用创建文件夹
//        createFolder("F:\\github\\util.you.com@gmail.com\\jdk\\src\\main\\java\\jdk\\util\\sourceCode\\", "测试io文件夹");


        // 4.列出指定目录下面的所有文件，包括隐藏文件
//        listFiles("F:\\github\\util.you.com@gmail.com\\jdk\\src\\main\\java\\jdk\\util\\sourceCode\\");


        // 5.判断指定的 文件夹是否是一个 目录(即是否是一个 文件夹)
//        isFolder("F:\\\\github\\\\util.you.com@gmail.com\\\\jdk\\\\src\\\\main\\\\java\\\\jdk\\\\util\\\\sourceCode\\", "测试io文件夹");


        // 6. 向指定的文件中(需要在文件名中给出路径和文件名,我这里是为了简便这样写了)通过 字节流 写入数据 (这里前提：认为该文件已经存在,不需要再创建)
//        writeFileByByte("F:\\github\\util.you.com@gmail.com\\jdk\\src\\main\\java\\jdk\\util\\sourceCode\\测试io.txt");


        // 7.从指定的文件中读取内容
//        readFileByByte("F:\\github\\util.you.com@gmail.com\\jdk\\src\\main\\java\\jdk\\util\\sourceCode\\测试io.txt");


        // 8. 从 指定文件读取内容并写入到 目标文件
        readWriteFile("F:\\game\\xx.mp4",
                "E:\\github-project\\jdk\\src\\main\\java\\jdk\\util\\sourceCode\\测试io.txt");


    }


    /**
     * 因为 io 流基本是与 File(文件/文件夹) 操作密不可分的，因此 io 的操作，只要涉及到文件，文件夹的都必须使用 File 类
     * 在指定的路径下，新建一个 指定文件名的 文件
     * @param path 文件路径
     * @param fileName 文件名
     */
    public static void createFile(String path, String fileName){
        // 因为是在 操作 文件，所以用到 File 对象【记住：所有与文件/文件夹操作相关的内容，都必须第一时间想到要用 File 对象】
        File file = new File(path+fileName); // 实例化一个 file 操作对象
        try {
            file.createNewFile(); // 调用 file 文件/文件夹 实例对象的 方法，来新建文件
            System.out.println("目标文件已存在: " + path + fileName);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /**
     * 删除一个指定路径下的 文件
     * @param path 该文件的路径
     * @param fileName 该文件的文件名
     */
    public static void deleteFile(String path, String fileName){
        File file = new File(path+fileName);
        if(file.exists()){
            file.delete();
            System.out.println("目标文件已删除");
        }else{
            System.out.println("要删除的目标文件不存在");
        }
    }


    /**
     * 新建一个 文件夹
     * @param path 路径
     * @param folderName 文件夹名
     */
    public static void createFolder(String path, String folderName){
        File file = new File(path+folderName);
        file.mkdir();
        System.out.println("该文件夹已经存在于: " + path + folderName);
    }


    /**
     * 列出指定目录下面的所有文件
     * @param path 目录的路径名
     */
    public static void listFiles(String path){
        File file = new File(path);
        if (file.isDirectory()){
            File[] fileArray = file.listFiles();
            for (int i = 0; i < fileArray.length; i++){
                System.out.println( "该目录下的文件: " + fileArray[i]);
                System.out.println( "该目录下的文件或文件夹的名字: " + fileArray[i].getName());
            }
        }else{
            System.out.println(path + " 目录不存在");
        }
    }


    /**
     * 判断给定的 文件夹 是否是一个目录
     * @param path
     */
    public static void isFolder(String path, String folderName){
        File file = new File(path + folderName);
        if (file.isDirectory()){
            System.out.println(path + folderName + " 是一个目录");
        }else{
            System.out.println(path + folderName + " 不是一个目录");
        }
    }


    /**
     * 通过 字节流 向 指定文件 写入内容
     * @param fileName 文件名，这里为了简化，文件名中带上 路径
     */
    public static void writeFileByByte(String fileName){
        File file = new File(fileName);
        OutputStream outputStream = null; // 从内存中 写入内容 到 文件中，这是输出流，因此要用 输出流
        // FileOutputStream 的构造器大体上有两类：一类是 传入一个带有文件名和文件路径的字符串；另一类是 传入一个 File 文件/文件夹对象
        try {
            outputStream = new FileOutputStream(file, true); // 给 file 文件对象 构造一个字节输出流
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        // 这里穿插一个小知识点，即我们 给一个 int 参数，但是我们要让 outputStream 以 byte[] 的形式写入,接下来就看 int 转 byte[] 吧
        int a = 12345678; // 为什么这样呢？因为 一个 int 是 4个byte,所以一个 int 转成 byte[] 后，一定是里面包含4个byte元素的 byte[] 数组
        byte[] b = new byte[]{
                (byte) ((a >> 24) & 0xFF),
                (byte) ((a >> 16) & 0xFF),
                (byte) ((a >> 8) & 0xFF),
                (byte) ((a ) & 0xFF)
        };
        try {
            outputStream.write(b); // 这里还有一个问题没解决：写入的时候，选择编码格式(稍后解决)
            outputStream.close();
        }catch (IOException e) {
                e.printStackTrace();
            }
    }


    /**
     * 通过 字节流 从 指定文件 读取输出内容
     * @param fileName 文件名，这里为了简化，文件名中带上 路径
     */
    public static void readFileByByte(String fileName){
        File file = new File(fileName);
        InputStream inputStream = null; // 从 硬盘中 读取内容 到 内存中，这是 输入流，因此声明 输入流 对象
        try {
            inputStream = new FileInputStream(file);
            // inputStream 读取内容有5个方法 read():默认读取一个byte,readBytes(byte b[], int off, int len)
            // 这里我们采用 read(byte b[], int off, int len) 方法
            byte[] byter = new byte[1024]; // 所以先实例化一个 byte[]
            int len = inputStream.read(byter);
            inputStream.close();
            // 最后我们输出一下读取到的内容
            System.out.println(new String(byter, 0, len));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * @author: util.you.com@gmail.com
     * @param: [sourceFile, desFile]
     * @return: void
     * @date: 2019/5/25 18:04
     * @version: 1.0
     * @description: 最后来一个 从 指定文件中 读取内容 到 指定目标文件中
     */
    public static void readWriteFile(String sourceFile, String desFile){
        File inputFile = new File(sourceFile);
        File outputFile = new File(desFile);
        InputStream inputStream = null;
        OutputStream outputStream = null;
        try {
            inputStream = new FileInputStream(inputFile);
            byte[] byter = new byte[1024];
            inputStream.read(byter);
            outputStream = new FileOutputStream(outputFile, true);
            outputStream.write(byter);
            outputStream.close();
            inputStream.close();
            System.out.println("操作完成");
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
    }

}

```
