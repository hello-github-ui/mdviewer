> Vim是我非常喜欢的一款文本编辑器，它虽然没有Emacs那么华丽，但是也有自己的情迷粉丝。由于Vim每次安装都需要大量的个性化配置，这实在是有点浪费时间和精力，因此这里做一下备份。

## 下载安装

为了方便，快速使用，我这里提供了一个已经配置好的Vim版本，点击下载压缩包:
> [google drive](https://drive.google.com/file/d/1B1mRtztB5XrdPOi8BO_KksLCcXaL6of8/view?usp=sharing)
> [百度网盘 提取码: f63k](https://pan.baidu.com/s/1UFO_x0OHKgmIgImnjjgpxg)

解压后放到如下目录即可：

![](https://pic.imgdb.cn/item/6184a2772ab3f51d91d0dae9.jpg)

解压缩后，将目录下的`_vimrc`文件复制一份到 `~/_vimrc` 中，没有该文件就新增一个。

## 字体下载

因为配置中用到了支持真彩色的字体，因此需要额外下载字体：`Power_Consolas`。
**这里已经将改字体打压在上面的压缩包中了，解压后双击安装即可。**

## 配置快捷方式到开始菜单

首先进入目录 `D:\software\vim\app_home\vim82`，右键点击 `gvim.exe`，选择`创建快捷方式`，然后将该快捷方式剪切到目录
`C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Vim 8.2` 下，如果没有Vim 8.2就新建该名文件夹，然后放到该文件夹下即可。

## 插件管理器

vim-plug 是一个 vim 的插件管理插件(A minimalist Vim plugin manager)，安装使用简单，因为上面压缩包已经包括这个文件了，因此你也不需要下载了。

## 插件安装

上面压缩包内置了几个常用插件：
![](https://pic.imgdb.cn/item/6184a3f82ab3f51d91d31a94.jpg)

> 如果你还想安装其它插件，只需要按照上面的格式写即可：`Plug '' ` 即可。然后重启 Gvim，执行 `:PlugInstall `即可完成插件的安装。

当然你也可以直接下载该插件（一般后缀名是xx.vim）然后将其直接放置到如下目录即可。
![](https://pic.imgdb.cn/item/6184a4912ab3f51d91d3e4e3.jpg)

## 关于插件的使用

打开配置文件，都写有每个插件的使用姿势。

