---
title: Java代码的执行顺序
cover: 'https://pic.imgdb.cn/item/612110284907e2d39c445567.jpg'
categories:
  - code
tags:
  - Java
  - 基础
abbrlink: 10968
date: 2021-01-31 22:45:23
---

## Java 代码的执行顺序

通过以下代码，更加快速地理解代码的执行顺序，以助于理解jvm的加载顺序，帮助我们在写代码时，写出更深刻的代码。

### Sub 子类

```java
public class Sub {
    // 静态 不可变
    private static final String str1 = "00";
    // 不可变
    private final String str2 = "01";
    // 普通字符串
    private String str3 = "02";
    // 静态 字符串
    private static String str4 = "03";

    {
        System.out.println("Sub code block1 str1: " + str1);
        System.out.println("Sub code block1 str2: " + str2);
        System.out.println("Sub code block1 str3: " + str3);
        System.out.println("Sub code block1 str4: " + str4);
        System.out.println("Sub: " + "04");
    }

    static {
        System.out.println("Sub: " + "05");
        System.out.println("Sub Static block1 str1: " + str1);
        System.out.println("Sub Static block1 str4: " + str4);
    }

    {
        System.out.println("Sub: " + "06");
        System.out.println("Sub code block2 str1: " + str1);
        System.out.println("Sub code block2 str2: " + str2);
        System.out.println("Sub code block2 str3: " + str3);
        System.out.println("Sub code block2 str4: " + str4);
    }

    public Sub() {
        System.out.println("Sub: " + "07");
        System.out.println("Sub: " + str1);
        System.out.println("Sub: " + str2);
        System.out.println("Sub: " + str3);
        System.out.println("Sub: " + str4);
        // 修改 静态 字符串值
        str4 = str4 + "++Sub++";
        // 再输出
        System.out.println("Sub: " + str4);
        // 修改普通字符串
        str3 = str3 + "--Sub--";
        System.out.println("Sub: " + str3);
    }

    static {
        System.out.println("Sub: " + "08");
        System.out.println("Sub Static block2 str1: " + str1);
        System.out.println("Sub Static block2 str4: " + str4);
    }
}
```

### Father 父类

```java
public class Father extends Sub {
    // 静态 不可变
    private static final String str1 = "0";
    // 不可变
    private final String str2 = "1";
    // 普通字符串
    private String str3 = "2";
    // 静态 字符串
    private static String str4 = "3";

    {
        System.out.println("Father: " + 4);
    }

    static {
        System.out.println("Father: " + 5);
    }

    {
        System.out.println("Father: " + 6);
    }

    public Father() {
        System.out.println("Father: " + 7);
        System.out.println("Father: " + str1);
        System.out.println("Father: " + str2);
        System.out.println("Father: " + str3);
        System.out.println("Father: " + str4);
        // 修改 静态 字符串值
        str4 = str4 + "++Father++";
        // 再输出
        System.out.println("Father: " + str4);
        // 修改普通字符串
        str3 = str3 + "--Father--";
        System.out.println("Father: " + str3);
    }

    static {
        System.out.println("Father: " + 8);
    }
}
```

### Test 测试

```java
public class Test {
    // 静态 不可变
    private static final String str1 = "0000000";
    // 不可变
    private final String str2 = "0000001";
    // 普通字符串
    private String str3 = "0000002";
    // 静态 字符串
    private static String str4 = "0000003";

    static {
        System.out.println("Test: " + "0000004");
        System.out.println("Test Static code1 str1: " + str1);
        System.out.println("Test Static code2 str4: " + str4);
    }

    public Test() {
        System.out.println("Test: " + str1);
        System.out.println("Test: " + str2);
        System.out.println("Test: " + str3);
        System.out.println("Test: " + str4);
        // 修改 静态 字符串值
        str4 = str4 + "++Test++";
        // 再输出
        System.out.println("Test: " + str4);
        // 修改普通字符串
        str3 = str3 + "--Test--";
        System.out.println("Test: " + str3);
    }

    {
        System.out.println("Test: " + "0000005");
        System.out.println("Test code block1 str1: " + str1);
        System.out.println("Test code block1 str2: " + str2);
        System.out.println("Test code block1 str3: " + str3);
        System.out.println("Test code block1 str4: " + str4);
    }

    public static void main(String[] args) {
        System.out.println("Test: " + 4);
        Father test = new Father();
        System.out.println("\033[32;4m" + "==========================" + "\033[0m");
        Father test2 = new Father();
        System.out.println("Test: " + 5);
    }

    static {
        System.out.println("Test: " + "0000006");
        System.out.println("Test Static code2 str1: " + str1);
        System.out.println("Test Static code2 str4: " + str4);
    }

    {
        System.out.println("Test: " + "0000007");
        System.out.println("Test code block2 str1: " + str1);
        System.out.println("Test code block2 str2: " + str2);
        System.out.println("Test code block2 str3: " + str3);
        System.out.println("Test code block2 str4: " + str4);
    }
}
```

### 直接结果如下

```txt

Test: 0000004
Test Static code1 str1: 0000000
Test Static code2 str4: 0000003
Test: 0000006
Test Static code2 str1: 0000000
Test Static code2 str4: 0000003
Test: 4
Sub: 05
Sub Static block1 str1: 00
Sub Static block1 str4: 03
Sub: 08
Sub Static block2 str1: 00
Sub Static block2 str4: 03
Father: 5
Father: 8
Sub code block1 str1: 00
Sub code block1 str2: 01
Sub code block1 str3: 02
Sub code block1 str4: 03
Sub: 04
Sub: 06
Sub code block2 str1: 00
Sub code block2 str2: 01
Sub code block2 str3: 02
Sub code block2 str4: 03
Sub: 07
Sub: 00
Sub: 01
Sub: 02
Sub: 03
Sub: 03++Sub++
Sub: 02--Sub--
Father: 4
Father: 6
Father: 7
Father: 0
Father: 1
Father: 2
Father: 3
Father: 3++Father++
Father: 2--Father--
==========================
Sub code block1 str1: 00
Sub code block1 str2: 01
Sub code block1 str3: 02
Sub code block1 str4: 03++Sub++
Sub: 04
Sub: 06
Sub code block2 str1: 00
Sub code block2 str2: 01
Sub code block2 str3: 02
Sub code block2 str4: 03++Sub++
Sub: 07
Sub: 00
Sub: 01
Sub: 02
Sub: 03++Sub++
Sub: 03++Sub++++Sub++
Sub: 02--Sub--
Father: 4
Father: 6
Father: 7
Father: 0
Father: 1
Father: 2
Father: 3++Father++
Father: 3++Father++++Father++
Father: 2--Father--
Test: 5

Process finished with exit code 0
```

这个代码的结构理解是基本功，必须掌握精。

