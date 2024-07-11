# 一、Tinymce可视化编辑器

参考

https://panjiachen.gitee.io/vue-element-admin/#/components/tinymce

https://panjiachen.gitee.io/vue-element-admin/#/example/create

# 二、组件初始化

Tinymce是一个传统javascript插件，默认不能用于Vue.js因此需要做一些特殊的整合步骤

## 1、复制脚本库

将脚本库复制到项目的static目录下（在vue-element-admin-master的static路径下）

## 2、配置html变量

在 guli-admin/build/webpack.dev.conf.js 中添加配置

使在html页面中可是使用这里定义的BASE_URL变量

```
new HtmlWebpackPlugin({
    ......,
    templateParameters: {
        BASE_URL: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
    }
})
```

## 3、引入js脚本

在guli-admin/index.html 中引入js脚本

```
<script src=<%= BASE_URL %>/tinymce4.7.5/tinymce.min.js></script>
<script src=<%= BASE_URL %>/tinymce4.7.5/langs/zh_CN.js></script>
```

# 三、组件引入

为了让Tinymce能用于Vue.js项目，vue-element-admin-master对Tinymce进行了封装，下面我们将它引入到我们的课程信息页面

## 1、复制组件

src/components/Tinymce

## 2、引入组件

课程信息组件中引入 Tinymce

```
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  ......
}
```

## 3、组件模板

```
<!-- 课程简介-->
<el-form-item label="课程简介">
    <tinymce :height="300" v-model="courseInfo.description"/>
</el-form-item>
```

## 4、组件样式

在info.vue文件的最后添加如下代码，调整上传图片按钮的高度

```
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
```

## 5、图片的base64编码

Tinymce中的图片上传功能直接存储的是图片的base64编码，因此无需图片服务器