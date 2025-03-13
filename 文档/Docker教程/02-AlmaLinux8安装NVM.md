> 不使用科学方式。

# AlmaLinux 8 安装 nvm 教程

> [!info] 提问
> almalinux8 如何安装 nvm 呢？我是在国内环境，访问 github 不太方便。

在国内环境下安装`nvm`（Node Version Manager）时，可以通过以下步骤绕过 GitHub 访问问题：

### 1. 安装依赖

首先，确保系统已安装`curl`和`git`：

```bash
sudo dnf install curl git -y
```

### 2. 下载 nvm 安装脚本

由于直接访问 GitHub 可能较慢，可以使用国内的镜像源下载`nvm`安装脚本。例如，使用`gitee`镜像：

```bash
curl -o- https://gitee.com/mirrors/nvm/raw/master/install.sh | bash
```

### 3. 配置环境变量

安装完成后，将`nvm`添加到环境变量中：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 加载 nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # 加载 nvm 自动补全
```

为了使配置永久生效，可以将上述内容添加到`~/.bashrc`或`~/.zshrc`文件中：

```bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc
```

然后重新加载配置文件：

```bash
source ~/.bashrc
```

### 4. 验证安装

检查`nvm`是否安装成功：

```bash
nvm --version
```

### 5. 安装 Node.js

使用`nvm`安装 Node.js 时，可以指定国内的镜像源加速下载：

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
nvm install --lts
```

### 6. 设置默认 Node.js 版本

安装完成后，可以设置默认的 Node.js 版本：

```bash
nvm alias default <version>
```

例如：

```bash
nvm alias default 16
```

### 7. 验证 Node.js 安装

检查 Node.js 和 npm 是否安装成功：

```bash
node -v
npm -v
```

通过这些步骤，你可以在 AlmaLinux 8 上成功安装`nvm`并管理 Node.js 版本。

---

> [!info] 提问
> -bash: sudo: command not found

`sudo`命令未找到通常是因为系统没有安装`sudo`包。在 AlmaLinux 8 上，可以通过以下步骤安装`sudo`：

---

### 1. 切换到 root 用户

由于没有`sudo`，你需要先切换到`root`用户：

```bash
su -
```

输入`root`用户的密码即可切换到`root`。

---

### 2. 安装 sudo

使用`dnf`包管理器安装`sudo`：

```bash
dnf install sudo -y
```

---

### 3. 将当前用户添加到 sudoers 文件

安装完成后，将你的用户添加到`sudoers`文件中，以便可以使用`sudo`命令。

#### 方法 1：使用`usermod`命令

将用户添加到`wheel`组（默认情况下，`wheel`组有`sudo`权限）：

```bash
usermod -aG wheel <你的用户名>
```

例如，如果你的用户名是`user1`，则运行：

```bash
usermod -aG wheel user1
```

#### 方法 2：手动编辑`/etc/sudoers`文件

使用`visudo`命令编辑`/etc/sudoers`文件：

```bash
visudo
```

在文件中找到以下行：

```
## Allows people in group wheel to run all commands
# %wheel  ALL=(ALL)       ALL
```

去掉`%wheel`前面的`#`注释符号，保存并退出：

```
%wheel  ALL=(ALL)       ALL
```

---

### 4. 验证 sudo 是否可用

退出`root`用户，回到普通用户：

```bash
exit
```

然后测试`sudo`命令：

```bash
sudo ls
```

如果系统提示输入密码并正常执行命令，说明`sudo`已配置成功。

---

### 5. 继续安装 nvm

现在你已经可以使用`sudo`了，可以继续按照之前的步骤安装`nvm`和 Node.js。

---

### 总结

1. 切换到`root`用户。
2. 安装`sudo`。
3. 将你的用户添加到`sudoers`文件。
4. 验证`sudo`是否可用。
5. 继续安装`nvm`和 Node.js。
   如果还有其他问题，请随时告诉我！
