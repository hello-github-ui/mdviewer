// ==UserScript==
// @name         自动登录到知乎网站
// @namespace    http://tampermonkey.net/
// @version      2024-04-11
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/signin?next=%2F
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // 跳到密码登录Tab
    setTimeout(function () {
        // 获取所有 tab 元素
        var tabs = document.querySelectorAll(".SignFlow-tab");
        console.log("tabs个数: ", tabs.length);

        // 检查是否找到了 tab 元素
        if (tabs.length >= 2) {
            // 将第一个 tab 设为关闭状态
            tabs[0].classList = "SignFlow-tab";
            // 将第二个 tab 设为活动状态，通过设置样式为 SignFlow-tab SignFlow-tab--active
            tabs[1].classList = "SignFlow-tab SignFlow-tab--active";

            // 找到 激活状态的 tab，并点击
            var div = document.querySelector(".SignFlow-tab--active");
            // 点击密码登录
            div.click();
            console.log("点击了密码登录tab");

            // 获取表单元素账号和密码输入框
            var originalUsernameInput = document.querySelector('input[name="username"]');
            var originalPasswordInput = document.querySelector('input[name="password"]');
            setTimeout(function () {
                originalUsernameInput.value = "19520569068";
                originalPasswordInput.value = "Hzhlz_0+++";

                setTimeout(function () {
                    // 获取登录按钮
                    var submitBtn = document.querySelector(".JmYzaky7MEPMFcJDLNMG");
                    // 检查是否找到了按钮元素
                    if (submitBtn) {
                        // 触发按钮点击事件
                        setTimeout(function () {
                            submitBtn.click();
                        }, 500);
                    } else {
                        alert("没有登录按钮被找到");
                    }
                }, 500);
            }, 500);
        } else {
            console.log("没有找到足够的a tab 元素");
        }
    }, 1000);
})();

