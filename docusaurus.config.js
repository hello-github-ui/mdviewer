// @ts-check
// Docusaurus 配置文件

// 该配置是为了 同时支持 github pages 和 render 部署
// 需要在 render 中部署时 的 环境变量中设置 RENDER=true
const isRender = process.env.RENDER === 'true';

// 用环境变量控制 baseUrl 和 Algolia indexName
const baseUrl = process.env.DOCUSAURUS_BASEURL || '/mdviewer/';
const algoliaIndexName = process.env.ALGOLIA_INDEXNAME || 'hello--uiio';

const config = {
    title: '我的文档站',
    tagline: '个人知识库',
    url: 'https://hello-github-ui.github.io', // 修改为你的GitHub Pages地址
    baseUrl: baseUrl,
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'system/logo.png', // 注意：这里不要写成 /system/logo.pn，因为所有写成 / 开头的都表示是从 根目录开始查找，而此处是需要拼接 baseUrl 的
    organizationName: 'hello-github-ui', // GitHub 用户名
    projectName: 'mdviewer', // 仓库名
    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/hello-github-ui/mdviewer/edit/master/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],
    themeConfig: {
        algolia: {
            appId: 'USTSQRVOIC',
            apiKey: '883c7e68caf11e7fe0d0edac924193fa',
            indexName: algoliaIndexName,
            contextualSearch: true,
            // 其它可选配置
        },
    },
};

module.exports = config; 