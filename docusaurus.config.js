// @ts-check
// Docusaurus 配置文件

const config = {
    title: '我的文档站',
    tagline: '个人知识库',
    url: 'https://hello-github-ui.github.io', // 修改为你的GitHub Pages地址
    baseUrl: '/mdviewer/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: '/mdviewer/system/logo.png',
    organizationName: 'hello-github-ui', // GitHub 用户名
    projectName: 'mdviewer', // 仓库名
    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/hello-github-ui/mdviewer/edit/main/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],
};

module.exports = config; 