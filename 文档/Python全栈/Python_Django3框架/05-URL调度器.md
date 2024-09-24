# URL调度器

## 1、工作原理

## 2、简单示例

## 3、路径转换器

## 4、自定义路径转换器

## 5、使用正则表达式

## 6、使用默认值

## 7、错误处理

## 8、引用其它URL调度器

- 多个 `patterns`

```python
from django.urls import path, include

extra_patterns = [
    path('reports/', credit_views.report),
    path('reports/<int:id>', credit_views.report),
    path('charge/', credit_views.charge),
]

urlpatterns = [
    path('', main_views.homepage),
    path('help/', include('app.help.urls')),
    path('credit', include(extra_patterns)),
]
```

- 使用 `include` 消除重复前缀

```python
from django.urls import path
from . import views

urlpatterns = [
    path('<page_slug>-<page_id>/history/', views.history),
    path('<page_slug>-<page_id>/edit/', views.edit),
    path('<page_slug>-<page_id>/discuss/', views.discuss),
    path('<page_slug>-<page_id>/permissions/', views.permissions),
]

# 修改为：
from django.urls import include, path
from . import views

urlpatterns = [
    path('<page_slug>-<page_id>/', include([
        path('history/', views.history),
        path('edit/', views.edit),
        path('discus/', views.discuss),
        path('permissions/', views.permissions),
    ]))
]
```

- 传递捕获的参数

在 `主urls` 中配置：

```python
urlpatterns = [
    path('admin/', admin.site.urls),
    # 这里捕获username参数，类型为字符串
    path('<username>/polls/', include('polls.urls'))
]
```

对应的  polls 应用下的 urls 中配置：

```python
urlpatterns = [
    path('arg_test/', views.arg_test)
]
```

对应的 polls 应用下的 views 中编写函数：

```python
# 第一个参数必须为request/req
def arg_test(request, username):
	return HttpResponse(f'usernmae: {username}')
```



## 9、额外的参数

## 10、URL反向解析

url调度器除了从用户发起请求，到匹配对应的 `view`，还能在python程序中调用进行匹配，通过`path`或`re_path`中的 `name` 属性进行解析。

- 在模板中，使用url模板标签
- 在python代码中（主要是views），使用 `reverse()` 函数
- 在模型实例中，使用 `get_absolute_url()` 方法

示例：

在url中配置：

```python
from django.urls import path
from . import views

urlpatterns = [
    path('articles/<int:year>/', views.year_archive, name='news-year-archive'),
]
```



## 11、命名空间

