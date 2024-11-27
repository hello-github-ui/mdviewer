1. 控制面板，程序和功能，启用功能，勾选 适用于linux的windows子系统 和 虚拟机平台 选项。
2. 重启电脑
3. 打开 cmd，输入 wsl --list --online 查看可用的linux版本
4. 输入 wsl --install -d Ubuntu 安装
5. 安装完，出现正在启动 Ubuntu后，报错：WslRegisterDistribution failed with error: 0x800701bc
6. 解决方案：https://blog.csdn.net/qq_18625805/article/details/109732122
7. cmd继续输入命令：wsl --set-default-version 2
8. 然后在 cmd 中，继续输入命令：wsl --install -d Ubuntu
   然后就安装成功了。（我习惯linux中的默认用户是xiaohua，个人习惯）
9. 可以选择更新分发包：sudo apt update , apt list --upgradable

以下内容参考于：https://docs.microsoft.com/zh-cn/windows/wsl/tutorials/gui-apps

10. 安装Gedit，Gedit是GNOME桌面环境的默认文本编辑器

apt 更换阿里云源 https://zhuanlan.zhihu.com/p/36482795

https://juejin.cn/post/6966630345915498526
