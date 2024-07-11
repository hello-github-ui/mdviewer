// ==UserScript==
// @name         油猴中文网-自动关注up主
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1
// @description  油猴中文网-自动关注up主
// @author       Wyz
// @match        https://bbs.tampermonkey.net.cn/
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    "use strict";

    // 向头部，论坛 字样后边添加 添加该脚本功能提示
    // 获取 <div id="pt" class="bm cl">
    let parent = document.querySelector("#pt");

    let eles = parent.childNodes
    eles.forEach((item) => {
        console.log(`item: ${item.nodeName}`);
    })



    // <div class="y">
    // <a href="https://bbs.tampermonkey.net.cn/forum.php?mod=guide&amp;view=my" title="我的帖子">我的帖子</a><span class="pipe">|</span><a href="https://bbs.tampermonkey.net.cn/forum.php?mod=guide&amp;view=new" title="最新回复">最新回复</a></div>
    // <div class="z">
    // <a href="./" class="nvhm" title="首页">油猴中文网</a><em>»</em><a href="https://bbs.tampermonkey.net.cn/forum.php">论坛</a></div>
    // <div class="z"><h3>中文
    // </h3></div>
    // </div>


    // GM_xmlhttpRequest({
    //     url: "https://api.bilibili.com/x/relation/modify",
    //     method: "post",
    //     data: "fid=1037793830&act=1&re_src=11&jsonp=jsonp&csrf=e37f1881fd98f16756d16ab71109d37a",
    //     headers: {
    //         "Content-type": "application/x-www-form-urlencoded"
    //     },
    //     onload: function (xhr) {
    //         console.log(xhr.responseText);
    //     }
    // });
})();
