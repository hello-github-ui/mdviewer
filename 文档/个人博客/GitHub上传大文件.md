---
title: GitHub上传大文件
cover: 'https://img.imgdb.cn/item/604b9fb75aedab222cf8a2c0.jpg'
categories:
  - 记事本
tags:
  - GitHub
  - 视频
abbrlink: 57223
date: 2019-12-30 05:17:52
---

# github上传文件限制
github默认地上传文件限制是不超过100M，注意：是单个文件不能超过100M(注意：本篇的密码必须是SHA256加密后的密文)

# 如何解决呢？
其实GitHub提供了 `LFS` 专门来处理这类大文件的。
如下：

```bash
# 先安装 git lfs
git lfs install

# 标记跟踪哪些大文件，可以单个标记，也可以使用模式匹配某类文件
git lfs track "*.mp4"

# 之后就是常规的 add, commit, push 操作即可
```

# 这里以几个视频为例演示一下
<div style="width:100%;height:0px;position:relative;padding-bottom:56.250%;margin-top: 20px;"><iframe src="https://streamable.com/s/58743/wcgvid" frameborder="0" width="100%" height="100%" allowfullscreen style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden;"></iframe></div>

<div style="width:100%;height:0px;position:relative;padding-bottom:56.250%;margin-top: 20px;"><iframe src="https://streamable.com/s/b5669/hfmwv" frameborder="0" width="100%" height="100%" allowfullscreen style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden;"></iframe></div>

<div style="width:100%;height:0px;position:relative;padding-bottom:56.250%;margin-top: 20px;"><iframe src="https://streamable.com/s/2rmg8/lhlzaj" frameborder="0" width="100%" height="100%" allowfullscreen style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden;"></iframe></div>

<div style="width:100%;height:0px;position:relative;padding-bottom:56.250%;margin-top: 20px;"><iframe src="https://streamable.com/s/4csf1/xjejxe" frameborder="0" width="100%" height="100%" allowfullscreen style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden;"></iframe></div>

<div style="width:100%;height:0px;position:relative;padding-bottom:56.250%;margin-top: 20px;"><iframe src="https://streamable.com/s/i9ndt/ofkxmf" frameborder="0" width="100%" height="100%" allowfullscreen style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden;"></iframe></div>

<div style="width:100%;height:0px;position:relative;padding-bottom:56.250%;margin-top: 20px;"><iframe src="https://streamable.com/s/ibw58/agdzyi" frameborder="0" width="100%" height="100%" allowfullscreen style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden;"></iframe></div>

# 说明
 - [x] 🎉 观看到以上视频的前提是您可以成功地FQ哦，不然看不到视频哦
 - [x] 🏁 欢迎补充哦
