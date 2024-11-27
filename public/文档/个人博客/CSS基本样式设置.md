# <font color=#FF8C00>div中文字居中</font>

如何让一个div中的文字水平和垂直居中？设置如下：
给定该div的长宽（或者二者只给出其一也可）

```html
.box{
height: 100px;
width: 30%;
text-align: center; // 水平居中,如果不行，设置margin: auto; 也可
line-height: 100px; // 因为其内是文字，所以只需设置行高与高度一样即可
}
```

<img src="https://cdn.jsdelivr.net/gh/latin-xiao-mao/img/blog-content/css基本样式/1.webp"/>
