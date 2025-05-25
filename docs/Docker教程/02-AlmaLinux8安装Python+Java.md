---
id: AlmaLinux8安装Python+Java
title: AlmaLinux8安装Python+Java
tags: [Docker, Linux, AlmaLinux]
---

## 1.安装Python

### Step #1: Update Your System

```bash
sudo dnf update
sudo dnf upgrade
```

### Step #2: Install the Necessary Packages

Use the following command to install the necessary packages required for Python 3.9 installation:

```bash
sudo dnf install openssl-devel bzip2-devel libffi-devel
```

Then, you must install development tools on your AlmaLinux system using the following command:

```bash
sudo dnf groupinstall "Development Tools"
```

The ***groupinstall\*** command installs the Development Tools, a set of packages typically used for creating software from source code. The Development Tools assist developers in creating, debugging, maintaining, and supporting other programs and applications.

To confirm that gcc is correctly installed, use the following ***gcc\*** command. You should be aware that gcc is a compiler that creates binary files from source code:

```bash
gcc --version
```

Here is the output:

```bash
~]# gcc --version
gcc (GCC) 8.5.0 20210514 (Red Hat 8.5.0-18)
```

### Step #3: Installing Python Using dnf

You can use the following command to install Python 3.9 using ***dnf\***:

```python
sudo dnf install python39
```

After the installation, you can verify that Python 3.9 is installed by checking its version using any of the following commands:

```bash
python3.9 --version
python3 --version
```

### Step #4: 将Python指向Python3

```bash
#备份原来的python软链接
mv /usr/bin/python /usr/bin/python.bak

sudo ln -s /usr/bin/python3 /usr/bin/python
sudo ln -s /usr/bin/pip3 /usr/bin/pip
```

### Step #5: Installing PIP

```bash
# Linux：执行命令
python -m ensurepip --upgrade
#更新pip
python -m pip install --upgrade pip
```

## 2.安装Java

### Step #1: Updating the System

It’s always a good idea to make sure that you have the latest updates for your system. To do this, open up your terminal window and run the following command.

```bash
sudo yum update -y
```

### Step #2: Installing Java

You can run the command below to list all the available versions of OpenJDK in your CentOS 8 repository.

```bash
sudo yum search java | grep openjdk
sudo yum install java-8-openjdk -y
java -version
```

