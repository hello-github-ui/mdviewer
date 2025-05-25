---
id: 07-首页显示banner和课程名师数据【前端】
title: 07-首页显示banner和课程名师数据【前端】
tags: [尚硅谷]
---

# 一、首页banner数据显示

## 1、创建api文件夹，创建banner.js文件

![img](/assets/2025/05/26/day11/3785d6b5-66a6-43a7-a613-7d667e4a1606.png)

**banner.js**

```javascript
import request from '@/utils/request'
export default {
  getList() {
    return request({
      url: `/educms/banner/getAllBanner`,
      method: 'get'
    })
  }
}
```

## 2、在首页面引入，调用实现

```html
<script>
import banner from "@/api/banner"

export default {
  data () {
    return {
      swiperOption: {
        //配置分页
        pagination: {
          el: '.swiper-pagination'//分页的dom节点
        },
        //配置导航
        navigation: {
          nextEl: '.swiper-button-next',//下一页dom节点
          prevEl: '.swiper-button-prev'//前一页dom节点
        }
      },
      bannerList: {}
    }
  },
  created() {
    this.initDataBanner()
  },
  methods:{
    initDataBanner() {
      banner.getList().then(response => {
        this.bannerList = response.data.data.bannerList
      })
    }
  }
}
</script>
```

## 3、在页面遍历显示banner

```html
<!-- 幻灯片 开始 -->
<div v-swiper:mySwiper="swiperOption">
    <div class="swiper-wrapper">
        <div v-for="banner in bannerList" :key="banner.id" class="swiper-slide" style="background: #040B1B;">
            <a target="_blank" :href="banner.linkUrl">
              <img width="100%"
                :src="banner.imageUrl"
                :alt="banner.title"/>
            </a>
        </div>
 
    </div>
    <div class="swiper-pagination swiper-pagination-white"></div>
    <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
    <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
</div>
<!-- 幻灯片 结束 -->
```

# 二、首页显示课程和名师数据

## 1、创建api文件夹，创建index.js文件

![img](/assets/2025/05/26/day11/3785d6b5-66a6-43a7-a613-7d667e4a1606.png)

**index.js**

```javascript
import request from '@/utils/request'
export default {
  getList() {
    return request({
      url: `/eduservice/index`,
      method: 'get'
    })
  }
}
```

## 2、在首页面引入，调用实现

```html
<script>
import index from '@/api/index'
import banner from "@/api/banner"

export default {
  data () {
    return {
      swiperOption: {
        //配置分页
        pagination: {
          el: '.swiper-pagination'//分页的dom节点
        },
        //配置导航
        navigation: {
          nextEl: '.swiper-button-next',//下一页dom节点
          prevEl: '.swiper-button-prev'//前一页dom节点
        }
      },
      teacherList: {},
      courseList: {},
      bannerList: {}

    }
  },
  created() {
    this.initDataBanner()
    this.initDataObj()
  },
  methods:{
    initDataBanner() {
      banner.getList().then(response => {
        this.bannerList = response.data.data.bannerList
      })
    },

    initDataObj() {
      index.getList().then(response => {
        this.teacherList = response.data.data.teacherList
        this.courseList = response.data.data.courseList
      })
    }
  }
}
</script>
```

## 3、在页面遍历显示课程和名师

```html
 <div id="aCoursesList">
      <!-- 网校课程 开始 -->
      <div>
        <section class="container">
          <header class="comm-title">
            <h2 class="tac">
              <span class="c-333">热门课程</span>
            </h2>
          </header>
          <div>
            <article class="comm-course-list">
              <ul class="of" id="bna">
                <li v-for="(course, index) in courseList" v-bind:key="index">
                <div class="cc-l-wrap">
                    <section class="course-img">
<!-- ~/assets/photo/course/01.jpg -->
                        <img
                            :src="course.cover"
                            class="img-responsive"
                            :alt="course.title">
        <div class="cc-mask">
            <a :href="'/course/'+course.id" title="开始学习" class="comm-btn c-btn-1">开始学习</a>
            </div>
        </section>
                    <h3 class="hLh30 txtOf mt10">
                <a href="#" :title="course.title" class="course-title fsize18 c-333">{{course.title}}</a>
                    </h3>
                    <section class="mt10 hLh20 of">
                    <span class="fr jgTag bg-green" v-if="Number(course.price) === 0">
                    <i class="c-fff fsize12 f-fA">免费</i>
                    </span>
                    <span class="fr jgTag bg-green" v-else>
                    <i class="c-fff fsize12 f-fA"> ￥{{course.price}}</i>
                    </span>
                    <span class="fl jgAttr c-ccc f-fA">
                    <i class="c-999 f-fA">{{course.buyCount}} 人学习</i>
                                            |
                    <i class="c-999 f-fA">{{course.viewCount}} 人浏览</i>
                    </span>
                    </section>
                    </div>
                    </li>
              </ul>
              <div class="clear"></div>
            </article>
            <section class="tac pt20">
              <a href="#" title="全部课程" class="comm-btn c-btn-2">全部课程</a>
            </section>
          </div>
        </section>
      </div>
      <!-- /网校课程 结束 -->
      <!-- 网校名师 开始 -->
      <div>
        <section class="container">
          <header class="comm-title">
            <h2 class="tac">
              <span class="c-333">名师大咖</span>
            </h2>
          </header>
          <div>
            <article class="i-teacher-list">
              <ul class="of">
               <li v-for="(teacher,index) in teacherList" v-bind:key="index">
                <section class="i-teach-wrap">
                <div class="i-teach-pic">
                <a :href='"/teacher/"+teacher.id' :title="teacher.name">
                <img :alt="teacher.name" :src="teacher.avatar">
                </a>
                </div>
                <div class="mt10 hLh30 txtOf tac">
                <a :href='"/teacher/"+teacher.id' :title="teacher.name" class="fsize18 c-666">{{teacher.name}}</a>
                </div>
                <div class="hLh30 txtOf tac">
                <span class="fsize14 c-999">{{teacher.intro}}</span>
                </div>
                <div class="mt15 i-q-txt">
                <p
                                        class="c-999 f-fA"
                >{{teacher.career}}</p>
                </div>
                </section>
                </li>
              </ul>
              <div class="clear"></div>
            </article>
            <section class="tac pt20">
              <a href="#" title="全部讲师" class="comm-btn c-btn-2">全部讲师</a>
            </section>
          </div>
        </section>
      </div>
```