---
id: 03-使用ffmpeg下载抖音视频
title: 03-使用ffmpeg下载抖音视频
tags: [书签]
---

# ChatGPT 对话记录

## User
`使用python编写程序，要求可以下载这个链接的视频：https://v3-web.douyinvod.com/b16f5f0f0f0af989e1f09f24e47ad96d/67c31981/video/tos/cn/tos-cn-vd-0026/owe6C5CGgA7eIeNHIbA7dEAAAsLvQQev4APGfI/media-video-hvc1/?a=6383&ch=0&cr=8&dr=0&er=1&lr=default&cd=0%7C0%7C0%7C3&cv=1&br=285&bt=285&cs=4&ds=3&mime_type=video_mp4&qs=15&rc=PDc2ZjlpaGk0ODQ7N2ZpNkBpMzRpcHg5cnVoeDMzNGkzM0BjLjYwNS8yNTQxX2JfNTRjYSNjcnI2MmRjc3FgLS1kLS9zcw%3D%3D&btag=80000e00030000&dy_q=1740752388&l=20250228221948E6D6F8955946274B407C，`

## Assistant
`这是一个视频直链，Python 下载这种资源非常简单。下面是一个完整的 Python 脚本，可以把这个视频下载下来：Download Douyin Video这个脚本会把视频保存为 douyin_video.mp4。运行前确保已安装 requests 库，可以用命令 pip install requests 安装。运行时如果出现403错误，很可能是这个链接需要带请求头。需要加上一个简单的 headers，比如带上 User-Agent，告诉服务器是通过浏览器访问的。要不要加这个部分，你可以先试试上面代码，不行的话再告诉我，我们加请求头解决！🚀`

## User
`执行报错：
下载失败: 403 Client Error: Forbidden for url: https://v3-web.douyinvod.com/b16f5f0f0f0af989e1f09f24e47ad96d/67c31981/video/tos/cn/tos-cn-vd-0026/owe6C5CGgA7eIeNHIbA7dEAAAsLvQQev4APGfI/media-video-hvc1/?a=6383&ch=0&cr=8&dr=0&er=1&lr=default&cd=0%7C0%7C0%7C3&cv=1&br=285&bt=285&cs=4&ds=3&mime_type=video_mp4&qs=15&rc=PDc2ZjlpaGk0ODQ7N2ZpNkBpMzRpcHg5cnVoeDMzNGkzM0BjLjYwNS8yNTQxX2JfNTRjYSNjcnI2MmRjc3FgLS1kLS9zcw%3D%3D&btag=80000e00030000&dy_q=1740752388&l=20250228221948E6D6F8955946274B407C`

## Assistant
`这是因为视频地址需要带请求头来伪装成浏览器访问，403 就是服务器拒绝了直接访问。我们加上一个 User-Agent 和 Referer 试试。更新下代码：已进行 1 处编辑这次加了一个模拟浏览器的 User-Agent，以及带上 Referer（通常抖音视频需要这个）。再试试，有问题再告诉我！🚀`

## User
`刚才上面下载的视频文件没有声音，抖音还有一个这个链接是音频文件，要i求可以把视频和音频合在一起。音频文件链接为：https://v3-web.douyinvod.com/0faa0e88b0c9558987ee835b530008ae/67c31b59/video/tos/cn/tos-cn-vd-0026/owes56ICPANZo7Q3HvfbGqAIGeAzLEACeIAe7g/media-audio-und-mp4a/?a=6383&ch=0&cr=8&dr=0&er=1&lr=default&cd=0%7C0%7C0%7C3&cv=1&br=63&bt=63&cs=4&mime_type=video_mp4&qs=11&rc=Ozc6NWQ0ZmY4NjUzZzY5Z0BpMzRpcHg5cnVoeDMzNGkzM0BjMDY2XmAxLTYtYjAwY2A2YSNjcnI2MmRjc3FgLS1kLS9zcw%3D%3D&btag=80000e00030000&dy_q=1740752860&l=2025022822274043D7988F4503D34C2460`

## Assistant
`我们可以同时下载音频和视频，然后用 ffmpeg 合成一个完整的视频文件。我帮你改下代码，把音频和视频合在一起。已进行 1 处编辑这个版本会同时下载视频和音频文件，并使用 ffmpeg 将它们合成带声音的视频。确保你的系统里已经安装了 ffmpeg，可以用 ffmpeg -version 来检查。🎥🎶`

## User
`如何安装 ffmpeg 呢？`

## Assistant
`在不同系统上安装 ffmpeg 的方法不太一样，按照你的环境来选：Windows：去 ffmpeg [官网](https://github.com/BtbN/FFmpeg-Builds/releases) 下载 Windows 版本。解压后，把解压目录下的 bin 文件夹路径（比如 C:\\ffmpeg\\bin）加到系统环境变量 Path 中。打开命令提示符，运行 ffmpeg -version 验证是否成功安装。CentOS / AlmaLinux（在 Docker 容器里）：bash复制编辑sudo yum install epel-release -y
sudo yum install ffmpeg -y
Ubuntu / Debian：bash复制编辑sudo apt update
sudo apt install ffmpeg -y
安装好后，运行 ffmpeg -version 确认安装成功。试试看，合成效果应该就有声音了！🚀🎶`

## User
`不对了，只有声音，没有人物了。`

## Assistant
`看起来可能是合并参数的问题，导致只保留了音频。我们可以明确指定把视频和音频都保留。试试这个命令修正：bash复制编辑ffmpeg -i video.mp4 -i audio.mp4 -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -strict experimental output.mp4
我帮你改进代码吧！已进行 1 处编辑现在应该会保留视频和音频了！试试看有没有声音和画面都正常？🎥🎶`

## User
`
还是不行啊，一个只有声音，一个只有视频，没有生成douyin_final_video.mp4文件。并且控制台还有这样的乱码输出：
下载完成: douyin_video.mp4
下载完成: douyin_audio.mp4
'ffmpeg' �����ڲ����ⲿ���Ҳ���ǿ����еĳ���
���������ļ���
合成完成，保存为 douyin_final_video.mp4
。
`

## Assistant
`
看起来你的系统没识别到 ffmpeg，所以命令没执行成功。让我们一步一步来解决：确认 ffmpeg 安装是否成功（Windows）：
打开 命令提示符（cmd），输入：cmd复制编辑ffmpeg -version
ffmpeg -版本如果提示 'ffmpeg' 不是内部或外部命令，说明环境变量没配好或者 ffmpeg 没安装。检查 ffmpeg 安装和环境变量（Windows）：确认 ffmpeg 解压后的目录下有 bin 文件夹，里面应该有 ffmpeg.exe。把 bin 文件夹路径（如 C:\ffmpeg\bin）加入系统环境变量 Path。加完后重启 cmd，再次执行 ffmpeg -version 检查。如果仍有问题，可以直接用绝对路径执行 ffmpeg：
修改你的代码，把这行：python复制编辑command = f"ffmpeg -i {video_file} -i {audio_file} -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -strict experimental {output_file}"
改为（假设你的 ffmpeg 在 C:\\ffmpeg\\bin 下）：python复制编辑command = f"C:\\ffmpeg\\bin\\ffmpeg.exe -i {video_file} -i {audio_file} -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -strict experimental {output_file}"
试试看还有没有问题，或者如果报错信息有变化，可以告诉我一起看看怎么搞定！🚀
`

## User
ok了。

## Assistant
太棒了！如果之后想要加个进度条、合并更多文件，或者有其他需求，告诉我就行！🚀🎉

![image-20250301000935120](/assets/2025/05/25/image-20250301000935120.png)