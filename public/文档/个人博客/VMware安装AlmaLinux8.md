# 安装及配置网络

## Human

*2025-02-27 07:10:50 UTC*

请给我一份vmware17 pro安装AlmaLinux-8.8-x86_64-minimal.iso后可以正常实现ping www.baidu.com 的步骤。

## Assistant [使用模型: gpt-4o]

*2025-02-27 07:10:25 UTC*

这里是一份完整的 VMware Workstation Pro 17 安装 AlmaLinux 8.8 Minimal 并实现外网连通（如 `ping www.baidu.com`）的详细步骤。🚀  

##### 1️⃣ 在 VMware 中创建 AlmaLinux 虚拟机  
1. **打开 VMware Workstation Pro 17**，点击 **"创建新的虚拟机（Create a New Virtual Machine）"**。  
2. 选择 **"典型（Typical）"** 安装，点击 **"下一步"**。  
3. 选择 **"稍后安装操作系统（I will install the operating system later）"**，点击 **"下一步"**。  
4. 客户机操作系统选择：  
   - **Linux**  
   - 版本选择 **CentOS 8 64-bit**（AlmaLinux 是 CentOS 的下游兼容版本）。  
5. 虚拟机名称：`AlmaLinux-8.8`（随你喜欢）。  
6. 存储位置：选择一个合适的位置。  
7. 磁盘大小：**20GB**（建议最少 20GB）。  
   - 选择 **将虚拟磁盘拆分为多个文件（Split virtual disk into multiple files）**。  
8. 完成设置，点击 **"完成"**。  

---

##### 2️⃣ 挂载 AlmaLinux 8.8 Minimal ISO  
1. 选择刚创建好的虚拟机，点击 **"编辑虚拟机设置（Edit Virtual Machine Settings）"**。  
2. 选择 **CD/DVD（SATA）**，勾选 **"使用 ISO 映像文件（Use ISO image file）"**。  
3. 浏览并选择你的 `AlmaLinux-8.8-x86_64-minimal.iso` 文件。  
4. 勾选 **"连接（Connect at power on）"**。  

---

##### 3️⃣ 设置虚拟机网络模式  
在虚拟机设置中：  
1. 选择 **"网络适配器（Network Adapter）"**。  
2. 网络连接选择 **"NAT（使用主机的共享 IP 地址）"**（推荐 NAT 模式，简单稳定）。  
3. 勾选 **"连接（Connect at power on）"**。  

---

##### 4️⃣ 启动 AlmaLinux 安装  
1. 启动虚拟机，进入 AlmaLinux 安装界面，选择 **"Install AlmaLinux 8"**。  
2. 语言选择 **简体中文（或英语）**。  
3. **软件选择（Software Selection）**，选择 **"最小安装（Minimal Install）"**。  
4. **安装目标（Installation Destination）**，选择默认磁盘，直接点击 **"完成"**。  
5. **网络和主机名（Network & Hostname）**：  
   - 开启网络（右上角打开网卡）。  
   - 确认网卡获取到了 `192.168.xx.xx` 类型的 IP（如果是 NAT 模式，应该是这个网段）。  
6. **开始安装（Begin Installation）**。  
7. 设置 **root 密码**。  
8. 安装完成后，点击 **"重启系统（Reboot）"**。  

---

##### 5️⃣ 配置静态 IP（可选）  
如果需要固定 IP，例如 `192.168.80.100`：  
1. 编辑网卡配置（假设网卡是 `ens33`）：  

```bash
sudo vi /etc/sysconfig/network-scripts/ifcfg-ens33
```

2. 修改内容如下：

```bash
BOOTPROTO=none
ONBOOT=yes
IPADDR=192.168.80.100
NETMASK=255.255.255.0
GATEWAY=192.168.80.2
DNS1=8.8.8.8
DNS2=8.8.4.4
```

3. 重启网络服务：

```bash
sudo systemctl restart NetworkManager
```

---

##### 6️⃣ 确认网络是否正常  
1. 确认网卡是否正常启动：

```bash
ip a
```

确保 `ens33` 有 IP 地址。  

2. 确认默认网关：

```bash
ip route show
```

输出应该包含：

```bash
default via 192.168.80.2 dev ens33
```

3. 确认 DNS 配置：

```bash
cat /etc/resolv.conf
```

确保包含有效的 DNS，如：

```bash
nameserver 8.8.8.8
nameserver 8.8.4.4
```

4. 测试网络连通性：

```bash
ping 8.8.8.8 -c 4      # 测试外网 IP
ping www.baidu.com -c 4 # 测试域名解析
```

---

##### 7️⃣ 常见问题排查  
**1. ping IP 正常但 ping 域名失败：**
- 确认 DNS 配置正确，修改 `/etc/resolv.conf`：

```bash
nameserver 8.8.8.8
nameserver 8.8.4.4
```

- 重启网络：

```bash
sudo systemctl restart NetworkManager
```

**2. ping IP 和域名都失败：**
- 确认默认路由：

```bash
ip route show
```

如无默认路由，手动添加：

```bash
sudo ip route add default via 192.168.80.2 dev ens33
```

- 确认防火墙状态（可暂时关闭排查问题）：

```bash
sudo systemctl stop firewalld
sudo systemctl disable firewalld
```

- 确认 SELinux 状态（可暂时关闭排查问题）：

```bash
sudo setenforce 0
```

---

这套流程走完，`ping www.baidu.com` 应该就正常了！如果中间哪一步卡住，告诉我具体报错或输出，我们继续排查。🚀✨

# 禁用GPG校验

> **永久禁用 GPG 校验**会带来一定的安全风险，因为 GPG 校验是用来确认软件包的来源和完整性，防止安装被篡改或不受信任的软件包。只有在测试环境或者内网环境下，才建议考虑这么做。
>
> 如果你确实需要在 AlmaLinux 上永久禁用 GPG 校验，可以这样操作：

1️⃣ 修改 `yum` 配置文件：

```bash
sudo vi /etc/yum.conf
```

在文件中添加或确认这一行：

```ini
gpgcheck=0
```

> 临时禁用某个软件下载时的 校验：
>
> `sudo yum install -y git --nogpgcheck`

2️⃣ 禁用单个仓库的 GPG 校验（更推荐这种方法，只对某个特定仓库禁用）：
比如针对 AlmaLinux 官方源：

```bash
sudo vi /etc/yum.repos.d/almalinux.repo
```

找到每个 `[baseos]`、`[appstream]` 等部分，在其中加上：

```ini
gpgcheck=0
```

3️⃣ 清理缓存并刷新：

```bash
sudo yum clean all
sudo yum makecache
```

# 安装Vim

执行命令：

```bash
sudo yum install -y vim
```

# 安装Git

1️⃣ 安装 Git：

```bash
sudo yum install -y git
```

确认安装成功：

```bash
git --version
```

2️⃣：配置 GitHub 镜像加速（临时方案）

如果你需要加速 GitHub 的访问，可以考虑配置 `hosts` 文件加速：

```bash
sudo vi /etc/hosts
```

添加以下内容（最新 IP 地址可以在一些公共加速站点获取，可以通过查询如下网址最新ip）：

```ini
140.82.112.4      github.com
185.199.108.133   raw.githubusercontent.com
```

> **kkgithub.com**：另一个可用的 GitHub 镜像站点。
>
> **gitclone.com**：专门用于加速 GitHub 资源下载。

# 安装Tar

```bash
sudo yum install -y tar
```

# 安装NVM以及Node

方法 1️⃣：使用国内镜像安装 NVM（推荐），替换地址参考：https://help.kkgithub.com/questions/

```bash
curl -o- https://raw.kkgithub.com/creationix/nvm/v0.33.11/install.sh | bash
```

方法 2️⃣：手动下载并执行安装脚本

1. 打开一个浏览器，访问这个链接的国内镜像（比如 `ghproxy.com`）：

```ruby
https://ghproxy.com/https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh
```

2. 将页面内容保存为 `install.sh` 文件。

3. 在 AlmaLinux 中将文件传到你的虚拟机（比如用 `scp`、`rz` 或者共享文件夹）。

4. 在 AlmaLinux 执行这个安装脚本：

```bash
bash install.sh
```

方法 3️⃣：配置 GitHub 镜像加速（临时方案）

如果你需要加速 GitHub 的访问，可以考虑配置 `hosts` 文件加速：

```bash
sudo vi /etc/hosts
```

添加以下内容（最新 IP 地址可以在一些公共加速站点获取）：

```ini
140.82.112.4      github.com
185.199.108.133   raw.githubusercontent.com
```

保存后再执行安装命令。

方法 4️⃣：更换 NVM 官方镜像源（国内加速）
安装成功后，NVM 本身的节点版本管理也可以用国内镜像加速：

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/
nvm install node
```

# 安装JDK

下载 [jdk](https://www.oracle.com/hk/java/technologies/javase/javase8-archive-downloads.html)

**解压缩**

```bash
# 提前创建好 /opt/module 目录
tar -zxvf jdk-8u202-linux-x64.tar.gz -C /opt/module/
```

**配置JDK 环境变量**

```bash
sudo vim /etc/profile.d/my_env.sh
```

写入：

```bash
# JDK
export JAVA_HOME=/opt/module/jdk1.8.0_202
export PATH=$PATH:$JAVA_HOME/bin
```

加载环境变量：

```bash
source /etc/profile.d/my_env.sh
```

