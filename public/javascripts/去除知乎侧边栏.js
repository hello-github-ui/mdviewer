// ==UserScript==
// @name         去除知乎侧边栏
// @namespace    http://zhihu.com/
// @version      2024-04-11
// @description  去除知乎页面右侧的侧边栏，让页面更简洁
// @author       qiyue
// @match        https://www.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 获取右侧侧边栏元素，并将其移除
    let sidebar = document.querySelector(".css-1qyytj7");
    if (sidebar) {
        sidebar.remove();
    }

    // 调整主内容区域的宽度
    let main = document.querySelector(".Topstory-mainColumn");
    if (main) {
        main.style.width = "100%";
    }
})();
