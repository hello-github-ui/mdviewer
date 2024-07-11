// 如果要让脚本往页面上添加新元素，原理如下：
// 1. 首先使用 document.createElement() 创建好你想插入的元素，例如阿牛就写：document.createElement("button")
// 2. 然后找到你想要插入的位置，使用 append/insertBefore 之类的方法插入你的 element，之后就可以在 f12开发者工具中的 element 中看到元素了

// 如果你有很多组件想放进去的话，可以使用 document.createElement("div")，然后往 element 里的 innerHTML 直接写 html 代码
// 例如：
// let div = document.createElement("div");
// div.innerHTML = "<span>span1</span><span>span2</span>";
// // 插入到页面的body中
// document.body.append(div)


/*单元素监听*/
// let btn = document.createElement("button");
// btn.innerHTML = "按钮文字，其实也可以写html，变成下面的样子(不过谁用按钮来包那么多html标签呢)";
// // innerText 也可以，区别是 innerText 不会解析 html
// btn.onclick = function (){
//     alert("点击了按钮");
// };
// // 插入到目标位置
// document.body.append(btn);


// 生成随机颜色
let randomColor = function () {
    return "#" + Math.random().toString(16).slice(2, 8);
};

/*多元素监听*/
// 创建一个新的div元素
let div = document.createElement("div");
// 向这个div元素中添加入内容
div.innerHTML = "<span id=\"span-1\" style=\"font-size:12px\">span1</span><span class=\"sp\" style=\"color:red\">span class</span>";
div.style.color = randomColor(); // 注意：randomColor 函数的定义一定要放在调用之前（之上）
// 绑定监听事件
div.onclick = function (event) {
    if (event.target.id === "span-1") {
        alert("span-1被点击了");
    } else if (event.target.className === "sp") {
        alert("sp这一类被点了");
    }
};
// 将div元素插入到目标位置
document.body.append(div);


