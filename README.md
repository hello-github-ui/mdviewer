# 我的个人文档站

本项目基于 [Docusaurus](https://docusaurus.io/) 搭建，支持系列文档、标签、静态资源、自动部署等功能。

---

## 功能特性
- 支持 Markdown 文档自动渲染
- 支持系列文档（如 Python 系列）和单篇文章
- 支持标签检索
- 支持图片、视频等静态资源引用
- 支持分页、模糊搜索
- 支持 GitHub Actions 自动部署到 GitHub Pages

---

## 目录结构

```
my-docs/
  docs/                # 存放所有 Markdown 文档
    python-series/
      intro.md
    single-article.md
    intro.md           # 文档首页
  static/
    assets/            # 存放图片和视频
      2024/
        06/
          img1.png
  src/
    css/
      custom.css       # 自定义样式
    pages/
      index.js         # 首页跳转到文档首页
  .github/
    workflows/
      deploy.yml       # GitHub Actions 配置
  docusaurus.config.js # Docusaurus 配置
  sidebars.js          # 侧边栏配置
  package.json
  README.md
```

---

## 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```
2. **本地启动**（不会自动打开浏览器）
   ```bash
   npm run start
   ```
   访问 [http://localhost:3000/](http://localhost:3000/) 即可。

3. **添加/修改文档**
   - 新建 Markdown 文件放入 `docs/` 目录。
   - 系列文档可放入子文件夹，如 `docs/python-series/`。
   - 首页内容为 `docs/intro.md`。
   - 单篇文章直接放在 `docs/` 下。
   - 每篇文档建议加上 Frontmatter，例如：
     ```markdown
     ---
     id: python-intro
     title: Python 入门
     tags: [Python, 基础]
     ---
     ```

4. **添加图片/视频等静态资源**
   - 放到 `static/assets/YYYY/MM/` 目录下。
   - Markdown 中引用路径如：`/assets/2024/06/img1.png`

5. **首页自动跳转到文档首页**
   - `src/pages/index.js` 内容如下：
     ```js
     import React from 'react';
     import { Redirect } from '@docusaurus/router';
     export default function Home() {
       return <Redirect to="/docs/intro" />;
     }
     ```

6. **GitHub Actions 自动部署**
   - `.github/workflows/deploy.yml` 已配置好自动部署到 GitHub Pages。
   - 推送到 GitHub 后会自动构建并发布。

---

## 常见问题

- **首页 404 或 Page Not Found？**
  - 请确保有 `docs/intro.md` 文件，且 `src/pages/index.js` 跳转到 `/docs/intro`。
- **图片无法显示？**
  - 请将图片放在 `static/assets/` 下，引用路径以 `/assets/` 开头。
- **不想自动打开浏览器？**
  - `package.json` 的 `start` 脚本加 `--no-open`。

---

## 参考
- [Docusaurus 官方文档](https://docusaurus.io/)

如有更多需求或问题，欢迎随时提问！ 

## 加入搜索

#### 方案一：官方推荐的 Algolia DocSearch（最稳定、体验最佳）

##### 优点

- 支持 Docusaurus 3.x

- 体验极佳，速度快，支持中文、拼音、分词

- 免费用于开源/公开文档

##### 缺点

- 需要到 Algolia DocSearch 申请索引（需公开仓库）

- 需要配置 API Key

##### 配置步骤

1. 到 [Algolia DocSearch](https://docsearch.algolia.com/apply/) 申请账号和索引

   填写你的文档站点信息，等待官方邮件回复（通常1-2天）。

2. 获得 appId、apiKey、indexName 后，在 `docusaurus.config.js` 配置：

```js
  themeConfig: {
     algolia: {
       appId: '你的appId',
       apiKey: '你的apiKey',
       indexName: '你的indexName',
       contextualSearch: true,
       // 其它可选配置
     },
   },
```

3. 重启项目，右上角会自动出现搜索框。

## 多环境构建与部署

### Render 部署（根路径 `/`）

```bash
npm run build:render
```
- 构建产物适用于 Render 部署，baseUrl 为 `/`，Algolia 索引名为 `hello--uiio-render`。

### GitHub Pages 部署（子路径 `/mdviewer/`）

```bash
npm run build:gh
```
- 构建产物适用于 GitHub Pages 部署，baseUrl 为 `/mdviewer/`，Algolia 索引名为 `hello--uiio-ghpages`。

> Algolia 索引需分别用对应的站点 URL 生成和上传，确保搜索跳转路径正确。