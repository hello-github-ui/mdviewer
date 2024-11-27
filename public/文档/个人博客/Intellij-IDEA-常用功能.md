## Tab 页

在 intellij idea 中，直接使用快捷键 `ctrl+e` 来找到最近访问过的文件；
使用 `ctrl+shift+e` 来访问最近编辑过的文件。

## 跳到特定的文件夹

在intellij idea 中，可以输入 `/文件夹名` 来跳到特定的文件夹（使用double shift快捷键）。

## 快速补全行末分号

Java 中，每一条语句的末尾都得加上 `;` 号，我们可以在行中任意位置使用快捷键 `ctrl+shift+enter` 来快速补全分号。

## Rest Client

intellij idea 中内置了一个 rest client，可以通过 `ctrl+shift+a` 调出面板，然后搜索 rest client 来找到，打开以后可以看到一个简单的
rest client。
之所以说它比较简单是因为觉得还是 postman 更加强大，相比之下， rest client 则要显得逊色得多。

## 粘贴板历史选择

直接通过快捷键 `ctrl+shift+v` 来访问历史 粘贴板。

## Language Injection

大家都知道在 Java 的 String 中编辑有 JSON 的话有多麻烦，各种转义真是让人疯狂，在 Intellij IDEA 中，我们可以直接使用
Intellij IDEA 的 Language Injection 的功能（`Alt + Enter`）将一个字符串标记为 JSON，就可以非常方便地编写 JSON
了，再也不用担心转义的问题了。

## Smart Step Into

在 Debug 的时候，如果一行代码中有多行语句，我们又需要进入其中的一个方法调用的话，经常做的方法是点开源代码，然后打上断点，或者直接右键
Run to Line，而不能使用快捷键快速将 Debug 的当前行进入到想要去的方法上，Intellij IDEA 提供了 Smart Step Into 的能力，只要使用
`Shift + F7`，就可以选择到底要 Debug 进入哪一个方法。

## 多行编辑

以前要做多行编辑，总是现在 Sublime 里面先做好，然后再拷贝回到 IDEA 里面，现在知道了 IDEA 本身就自带这个功能，快捷键是
`alt+Shift+鼠标`，直接来看一个 gif 动画看来这个功能吧：

![select_multi_line.gif](https://img.imgdb.cn/item/608837c2d1a9ae528f2ffa78.gif)

## 快速打印输出

除了用 `sout` 开头快速生成，还能在后面快速生成。

![sout.gif](https://img.imgdb.cn/item/608837c2d1a9ae528f2ffaae.gif)

## 快速定义局部变量

在字符串或者数字……后面输入 `.var`，回车，IDEA会自动推断并快速定义一个局部变量，不过它是 final 类型的

![var.gif](https://img.imgdb.cn/item/608837ced1a9ae528f30a2c1.gif)

## 快速定义成员变量

在值后面输入`.field`，可以快速定义一个成员变量，如果当前方法是静态的，那生成的变量也是静态的。

![static-var.gif](https://img.imgdb.cn/item/608837c2d1a9ae528f2ffad1.gif)

## 快速格式化字符串

在字符串后面输入`.format`，回车，IDEA会自动生成 String.format…语句，牛逼吧！

![format.gif](https://img.imgdb.cn/item/60883761d1a9ae528f2ab751.gif)

## 快速判断（非）空

```java
if (xx != null)
if (xx == null)
```

像上面这种判断空/非空的情况非常多吧，其实可以快速生成 if 判断语句块，非空：`.notnull` 或者 `.nn`，空：`.null`。

![null.gif](https://img.imgdb.cn/item/60883761d1a9ae528f2ab7f9.gif)

## 快速取反判断

输入 `.not` 可以让布尔值快速取反，再输入 `.if` 可快速生成 if 判断语句块。

![if.gif](https://img.imgdb.cn/item/60883761d1a9ae528f2ab782.gif)

## 快速遍历集合

下面是几种 for 循环语句的快速生成演示，`.for`, `.fori`, `.forr` 都可以满足你的要求

![for.gif](https://img.imgdb.cn/item/60883761d1a9ae528f2ab706.gif)

## 快速返回值

在值后面输入 `.return`，可以让当前值快速返回。

![return.gif](https://img.imgdb.cn/item/608837c2d1a9ae528f2ffa58.gif)

## 快速生成同步锁

在对象后面输入 `.synchronized`，可以快速生成该对象的同步锁语句块。

![synchronized.gif](https://img.imgdb.cn/item/608837c2d1a9ae528f2ffb0d.gif)

## 快速生成JDK8语句

下面演示的是快速生成 Lambda 以及 Optional 语句。

![Lambda .gif](https://img.imgdb.cn/item/60883761d1a9ae528f2ab7b9.gif)

## 常用快捷键列表

Alt+回车 导入包,自动修正

`Ctrl+N`  查找类

`Ctrl+Shift+N` 查找文件

`Ctrl+Alt+L`  格式化代码

`Ctrl+Alt+O` 优化导入的类和包

Alt+Insert 生成代码(如get,set方法,构造函数等)

`Ctrl+E`或者Alt+Shift+C 最近更改的代码

`Ctrl+R` 替换文本

Ctrl+F 查找文本

`Ctrl+Shift+Space` 自动补全代码

`Ctrl+空格` 代码提示

Ctrl+Alt+Space 类名或接口名提示

`Ctrl+P` 方法参数提示

Ctrl+Shift+Alt+N 查找类中的方法或变量

`Alt+Shift+C` 对比最近修改的代码

`Ctrl+D` 复制行

`Ctrl+X` 删除行(我习惯于修改成 ctrl + y)

Ctrl+/ 或 Ctrl+Shift+/ 注释（// 或者/*...*/ ）

`Ctrl+J`  自动代码

`Ctrl+H` 显示类结构图

`Ctrl+Q` 显示注释文档

Alt+F1 查找代码所在位置

Alt+1 快速打开或隐藏工程面板

`Ctrl+Alt`+ left/right 返回至上次浏览的位置

Alt+ left/right 切换代码视图

Alt+ Up/Down 在方法间快速移动定位

Ctrl+Shift+Up/Down 代码向上/下移动

`F2` 或Shift+F2 高亮错误或警告快速定位

`Ctrl+W` 选中代码，连续按会有其他效果

Ctrl+B 快速打开光标处的类或方法

`Ctrl+Alt+B` 快速打开实现类

**本文参考于[Intellij IDEA 的一些使用技巧](https://blog.khotyn.com/blog/2014/10/19/intellij-idea-feature/)
和[Intellij IDEA 智能补全的 10 个姿势](https://blog.csdn.net/ifeves/article/details/102607829)，在此表示感谢**


