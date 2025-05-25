// @ts-check
// Docusaurus 配置文件

const config = {
    title: '我的文档站',
    tagline: '个人知识库',
    url: 'https://你的github用户名.github.io', // 修改为你的GitHub Pages地址
    baseUrl: '/mdviewer/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: '/system/logo.png',
    organizationName: '你的github用户名', // GitHub 用户名
    projectName: 'my-docs', // 仓库名
    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/你的github用户名/my-docs/edit/main/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],
};

module.exports = config; 