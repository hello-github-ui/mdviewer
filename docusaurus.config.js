// @ts-check
// Docusaurus 配置文件

const config = {
    title: '我的文档站',
    tagline: '个人知识库',
    url: 'https://hello-github-ui.github.io', // 修改为你的GitHub Pages地址
    baseUrl: '/mdviewer/',
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
                    editUrl: 'https://github.com/hello-github-ui/mdviewer/edit/main/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],
    plugins: [
        [
            require.resolve('@cmfcmf/docusaurus-search-local'),
            {
                indexDocs: true,
                indexBlog: false,
                indexPages: true,
                language: ["zh", "en"],
            },
        ],
    ],
};

module.exports = config; 