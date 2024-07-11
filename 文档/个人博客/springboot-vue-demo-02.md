---
title: SpringBoot-Vue-demo-02
cover: 'https://pic.imgdb.cn/item/612110704907e2d39c44f884.jpg'
categories:
  - code
tags:
  - Vue
  - SpringBoot
  - ElementUI
abbrlink: 54309
date: 2020-06-16 22:16:15
---

# Vue + Element UI

先在<mark>[上一期](https://my-hugo-blog-latin-xiao-mao.vercel.app/springboot-vue%E4%B9%8Bcrud%E5%B0%8Fdemo%E4%B8%80/)</mark>的文章基础上引入 `element-ui` 依赖

## 添加 Element-UI依赖
##
`yarn add element-ui`

## 在 main.js 中注册组件，并使用

![](https://img.imgdb.cn/item/604b84d25aedab222ce9da67.png)

## 选择引入布局

[](https://element.eleme.cn/#/zh-CN/component/container)

选择一个你喜欢的布局，然后粘贴代码到你的 `App.vue` 文件中（放入你想要的目标文件中即可）

![](https://img.imgdb.cn/item/604b84e25aedab222ce9e633.png)

## 启动前端项目，浏览器查看效果

![](https://img.imgdb.cn/item/604b84ef5aedab222ce9ee57.png)

------

***现在呐，我们的菜单是写死的，并不符合我们的实际需求，因此我们需要修改为动态加载菜单***

# 使用 Vue-router来动态构建左侧菜单

## 先来创建几个示例页面

![](https://img.imgdb.cn/item/604b85005aedab222ce9f99b.png)

这时我们来访问页面，会发现有个问题

![](https://img.imgdb.cn/item/604b85005aedab222ce9f9a3.png)

![](https://img.imgdb.cn/item/604b85005aedab222ce9f9a9.png)

![](https://img.imgdb.cn/item/604b85265aedab222cea1298.png)

当我们的访问路径是：http://localhost:8080/pageTwo 或者 http://localhost:8080/pageOne 时是没有问题的，但是当是 http://localhost:8080/ 时会出现嵌套页面App.vue

这是我们需要解决的地方

那么怎么解决这个问题呢？首先我们需要来分析一下 `App.vue` 文件

## router-view 分析

我们当前的 应用程序是 spa 应用，原理就是在于这个 router-view。而这个和我们的 `/src/router/index.js` 相对应；当我们的访问路径是 `/` 时，路由视图会渲染如下页面：

![](https://img.imgdb.cn/item/604b85405aedab222cea2276.png)

而在 `App.vue` 文件中本身就是有内容的，这样就会出现嵌套了。

因此我们需要改变默认路由视图

编辑 `/src/router/index.js` 文件

```javascript
const routes = [
    {
        path: '/',
        name: '导航一',
        component: App,
        children: [
            {
                path: '/pageOne',
                name:　'页面一',
                component: PageOne
            },
            {
                path: '/pageTwo',
                name: '页面二',
                component: PageTwo
            }
        ]
    },
    {
        path: '/navigation',
        name: '导航二',
        component: App,
        children: [
            {
                path: '/pageThree',
                name: '页面三',
                component: PageThree
            },
            {
                path: '/pageFour',
                name: '页面四',
                component: PageFour
            }
        ]
    }
]
```

接着我们修改 `App.vue` 文件，因为我们不能将 侧边菜单栏写死啊，需要根据上面的路由动态生成菜单栏

![](https://img.imgdb.cn/item/604b855b5aedab222cea30d2.png)

![](https://img.imgdb.cn/item/604b855b5aedab222cea30d5.png)

因为我们需要遍历循环 `/src/router/index.js` 中的 routes 数组，所以通过上面的写法就可以实现了，同时菜单的名字也只能是动态获取 routes 数组里面的name属性了

但是现在又有一个问题了，就是上图显示的这两个导航同时会打开关闭，也就是没有给导航设置 index 属性值，所以我们就给他们设置一下index：

![](https://img.imgdb.cn/item/604b856d5aedab222cea3a99.png)

## Menu 与 router 的绑定

* <el-menu> 标签添加 router 属性
* 在页面中添加 <router-view> 标签，它是一个容器，可以动态渲染你选择的 router 。
* <el-menu-item> 标签的 index 就是要跳转的 router。

![](https://img.imgdb.cn/item/604b857f5aedab222cea4532.png)

还有一个小问题就是：当地址栏是 `/pageOne` 时，菜单栏的 `页面一` 并没有出现选中的样式，这不符合我们的要求，如下修改：

![](https://img.imgdb.cn/item/604b858e5aedab222cea4ded.png)

有如上思路后，我们再修改代码：

![](https://img.imgdb.cn/item/604b859c5aedab222cea55d7.png)



## 页面一替换为我们要展示的数据

## 添加分页

https://element.eleme.cn/#/zh-CN/component/pagination，复制代码到页面一中

[注意：Vue 只允许有一个div 的根节点，因此如果有两个容器的话，必须包在一个div下]

```html
<!--    添加分页 -->
        <el-pagination
            background
            layout="prev, pager, next"
            page-size="5"
            :total="50"
            @current-change="page"
        >
        </el-pagination>

```

设置每页的大小，同时添加 触发方法 @current-change

## 后端实现分页查询

由于我们使用的是 JPA，而其提供了一个 findAll 的重载方法就是关于分页的

```java
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@GetMapping("/findAll/{page}/{size}")
	public Page<Book> findAll(@PathVariable("page") Integer page, @PathVariable("size") Integer size){

		Pageable pageable = PageRequest.of(page-1, size);
		return bookRepository.findAll(pageable);
	}
```

由于 `Pageable` 是一个接口，这里我们用其实现类的静态方法构造实例

![](https://img.imgdb.cn/item/604b85b15aedab222cea6189.png)



## 添加数据

### 后端修改

JPA 已经封装了 save 方法，所以直接使用即可

```java
@PostMapping("/save")
	public Book save(@RequestBody Book book){ // 因为是post请求，所以需要使用 @RequestBody 注解将 json 数据转成 java对象

		return bookRepository.save(book);
	}
```

<u>注意 `@RequestBody` 的作用</u>

### 前端修改

从 element ui 官网上，查看 form 表单的使用

```html
<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="书名" prop="title">
            <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <el-form-item label="作者" prop="author">
            <el-input v-model="ruleForm.author"></el-input>
        </el-form-item>

        <el-form-item label="内容简介" prop="abs">
            <el-input v-model="ruleForm.abs"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>

</template>

<script>
    export default {
        name: "Add",
        data() {
            return {
                ruleForm: {
                    title: '',
                    author: '',
                    abs: ''
                },
                rules: {
                    title: [
                        { required: true, message: '请输入书名', trigger: 'blur' }
                    ],
                    author: [
                        { required: true, message: '请输入作者', trigger: 'blur' }
                    ],
                    abs: [
                        { required: true, message: '请输入内容简介', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                const _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //
                        axios.post('http://localhost:8181/book/save', _this.ruleForm).then( (resp) => {
                            if (resp != null){
                                // _this.$message({
                                //     message: '恭喜你，添加成功',
                                //     type: 'success'
                                // });

                                _this.$alert('《' + _this.ruleForm.title + '》添加成功', '消息', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        // 添加成功后，我们让页面自动跳转到 查询列表页面
                                        // 同时让 页面跳转到 查询列表界面
                                        // 先获取当前 路由，然后 push 进你的跳转目标页面
                                        _this.$router.push('/list')
                                    }
                                });

                                _this.resetForm(formName);

                                // 添加成功后，我们让页面自动跳转到 查询列表页面
                                // 先获取 当前路由 对象，然后 push 进你跳转的目标页面 路由即可
                                // _this.$router.push('/list');
                            }else
                                this.$message.error('添加失败');
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>

```

## 修改数据
### 新建修改组件
`Update.vue`
```html

```

***代码部分请参阅 `https://github.com/latin-xiao-mao/springboot-vue-demo/tree/bookManage-crud-demo`***
