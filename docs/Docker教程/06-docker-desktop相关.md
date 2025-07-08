---
id: 06-docker-desktop相关
title: docker-desktop相关内容
tags: [Docker, Linux, Docker-Desktop]
---

> 更多内容：参考：[docker-desktop更多](https://github.com/hello-github-ui/docker-tutorial/blob/master/docker-desktop%E6%95%99%E7%A8%8B.md)

## 1.修改容器的自启动设置

`docker desktop` 允许用户控制容器的自启动行为。如果你不希望某个容器在 `Docker` 启动时自动启动，你可以通过以下步骤来更改设置：

①。打开 Docker Desktop 应用，

②。点击右上角的设置按钮，

③。在设置中选择 “Docker Engine”，

④。在 “Daemon” 选项卡中找到 “experimental” 选项，并确保它被设置为 `true`。这样你就可以启用实验性功能，包括控制容器自启动的选项，

⑤。保存更改并 `重启 Docker Desktop` 以使设置生效。

![1](/assets/2025/07/08/PixPin_2025-07-08_22-11-43.png)

![1](/assets/2025/07/08/PixPin_2025-07-08_22-13-43.png)

接下来，对于已经创建好的容器，你可以通过以下命令来禁用其自启动特性:

```bash
docker update --restart=no <容器名或ID>
```

请将 `<容器名或ID>` 替换为你想要禁用自启动的容器的名称或ID。

对于尚未创建的容器，你可以在启动容器时使用 `--restart=no` 选项来确保它不会在 Docker 启动时自动启动：

```bash
docker run --restart=no -d <镜像名> <其它选项>
```

