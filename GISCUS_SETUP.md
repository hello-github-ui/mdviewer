# 🎯 Giscus 评论系统配置指南

GitHub 评论功能已集成完成！现在需要获取你的仓库配置信息。

## 📋 配置步骤

### 1. 开启 GitHub Discussions

1. 进入你的 GitHub 仓库：`https://github.com/hello-github-ui/mdviewer`
2. 点击 **Settings** 标签页
3. 滚动到 **Features** 部分
4. 勾选 **Discussions** 复选框
5. 点击 **Set up discussions**

### 2. 安装 Giscus App

1. 访问：https://github.com/apps/giscus
2. 点击 **Install**
3. 选择你的仓库 `hello-github-ui/mdviewer`
4. 完成安装

### 3. 获取配置参数

1. 访问：https://giscus.app/zh-CN
2. 在 **仓库** 部分填入：`hello-github-ui/mdviewer`
3. 在 **页面 ↔️ discussion 映射关系** 选择：`pathname`
4. 在 **Discussion 分类** 选择：`General` 或 `Announcements`
5. 复制生成的配置参数

### 4. 更新配置

复制以下信息并替换 `src/components/GiscusComments/index.js` 中的配置：

```javascript
// 从 giscus.app 复制以下参数：
repo = "hello-github-ui/mdviewer";
repoId = "你的真实repoId"; // 形如：R_kgDO...
category = "General";
categoryId = "你的真实categoryId"; // 形如：DIC_kwDO...
```

## ✅ 验证配置

配置完成后：

1. 运行 `npm run build && npm run serve`
2. 访问任意文档页面
3. 滚动到页面底部查看评论区
4. 尝试发表评论测试功能

## 🎨 自定义选项

可以在 `src/components/GiscusComments/index.js` 中调整：

-   `mapping`: 页面映射方式 (`pathname`, `url`, `title`)
-   `reactionsEnabled`: 是否启用表情反应 (`1` 或 `0`)
-   `inputPosition`: 评论框位置 (`top` 或 `bottom`)
-   `lang`: 界面语言 (`zh-CN`, `en`)

## 🔧 故障排除

**评论区不显示？**

-   检查 GitHub Discussions 是否已开启
-   确认 Giscus App 已安装到仓库
-   验证 `repoId` 和 `categoryId` 是否正确

**无法发表评论？**

-   确保已登录 GitHub 账号
-   检查仓库是否为公开仓库
-   确认仓库开启了 Discussions 功能

---

⭐ **提示**: 配置完成后，删除此文件：`rm GISCUS_SETUP.md`
