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

---

## 自定义侧边栏收缩/展开功能

### 实现思路

1. **自定义按钮组件**：在 `src/components/SidebarToggle.js` 新增收缩/展开按钮，按钮使用 `position: fixed` 固定在页面左上角，始终可见。
2. **自定义主题侧边栏**：在 `src/theme/DocSidebar/index.js` 覆盖 Docusaurus 默认侧边栏，使用 React 状态控制侧边栏的展开与收缩。
3. **样式控制内容隐藏**：在 `src/theme/DocSidebar/style.css` 中，收缩时只隐藏侧边栏内容（通过 `.menu` 类），不影响按钮显示。

### 主要代码与操作

#### 1. 新建/修改 `src/components/SidebarToggle.js`
```js
import React from 'react';
export default function SidebarToggle({ collapsed, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        position: 'fixed',
        top: 20,
        left: collapsed ? 0 : 240,
        zIndex: 1000,
        width: 32,
        height: 32,
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'left 0.3s',
      }}
      aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
    >
      {collapsed ? '>' : '<'}
    </button>
  );
}
```

#### 2. 新建/修改 `src/theme/DocSidebar/index.js`
```js
import React, { useState } from 'react';
import SidebarToggle from '../../components/SidebarToggle';
import OriginalDocSidebar from '@theme-original/DocSidebar';
import './style.css';

export default function DocSidebar(props) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <SidebarToggle collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} style={{height: '100%'}}>
        <OriginalDocSidebar {...props} />
      </div>
    </>
  );
}
```

#### 3. 新建/修改 `src/theme/DocSidebar/style.css`
```css
.sidebar-collapsed {
  width: 48px !important;
  min-width: 48px !important;
  overflow: hidden;
  transition: width 0.3s;
  position: relative;
}
.sidebar-collapsed .menu {
  opacity: 0;
  pointer-events: none;
  user-select: none;
}
.sidebar-expanded {
  width: 240px !important;
  min-width: 240px !important;
  transition: width 0.3s;
}
```

### 使用说明
- 启动项目后，页面左上角会有一个收缩/展开按钮，点击即可整体收缩或展开侧边栏。
- 收缩时，侧边栏内容完全隐藏，仅保留一个窄条和按钮。
- 按钮始终可见，不会被隐藏。

如需进一步美化或自定义按钮样式，可继续修改 `SidebarToggle.js` 和相关 CSS。