## 数据格式

Elasticsearch 是面向文档型的数据库，一条数据在这里就是一个文档。es里面的概念和关系型数据库中的概念比对如下，可以依此进行理解：

![](https://pic.imgdb.cn/item/612206514907e2d39ca63705.jpg)

## 索引操作

### 创建索引

对比关系型数据库，创建索引就等同于创建数据库。

在Postman中，向ES服务器发送put请求：http://localhost:9200/shopping

![](https://pic.imgdb.cn/item/6122092c4907e2d39cab993d.jpg)

### 查询索引

查询索引用的是get请求：

![](https://pic.imgdb.cn/item/61220a884907e2d39cadff77.jpg)

如果想查询当前ES所有的index（索引），怎么查呢？需要发送如下的get请求：

http://localhost:9200/_cat/indices?v

![](https://pic.imgdb.cn/item/61220d254907e2d39cb2b9fe.jpg)

### 删除索引

发送DELETE请求：http://localhost:9200/shopping

![](https://pic.imgdb.cn/item/61220db94907e2d39cb3c261.jpg)

## 文档操作

### 创建文档

索引已经创建好了，接下来我们创建文档，并添加数据。这里的文档可以类比为关系型数据库中的表数据，添加的数据格式为JSON格式。

在Postman中，向ES服务器发送POST请求：http://localhost:9200/shopping/_doc

请求体内容为：

```json
{
    "titile": "小米手机",
    "category": "小米",
    "images": "http://www.gulixueyuan.com/xm.jpg",
    "price": 3999.00
}
```

`_doc`就是表示文档，表示数据的意思，所以添加数据，就是用 `_doc`

![](https://pic.imgdb.cn/item/61220fb14907e2d39cb76176.jpg)

注意上面的post请求，返回数据中的 `_id` 是该条数据的id，是ES服务器随机生成的。

如果我们想自定义生成数据的id，可以吗？答案是可以的，只需要在请求时携带我们自定义的ID即可：

POST http://localhost:9200/shopping/_doc/1001

![](https://pic.imgdb.cn/item/6122109c4907e2d39cb90e3d.jpg)

### 查询文档

上面是根据ID单个查询的数据，如果想查询出这个索引下所有的数据？

GET http://localhost:9200/shopping/_search

![](https://pic.imgdb.cn/item/612212114907e2d39cbb8d08.jpg)

## 查询操作

### 条件查询

我们添加的数据中有一个分类（category）的属性，现在我们想查询分类是小米的数据：

GET http://localhost:9200/shopping/_search?q=category:小米

问号后面的q表示 query 的意思，后面跟键值对

![](https://pic.imgdb.cn/item/612214134907e2d39cbf2522.jpg)

上面这种直接在请求的url后面跟参数，而且还是中文，有时候就会有问题，所以我们一般采用下面的方式：

GET http://localhost:9200/shopping/_search

![](https://pic.imgdb.cn/item/612215114907e2d39cc0e1d4.jpg)

***查询所有的数据***

直接在请求体的参数中使用 `match_all`，查询所有的数据

![](https://pic.imgdb.cn/item/612215a04907e2d39cc1e8de.jpg)

但是呀，这样有个问题，查询的数据量太大了。我们得分页查询啊

### 分页查询

在请求参数中使用 from，size 参数

![](https://pic.imgdb.cn/item/612216e84907e2d39cc4022e.jpg)

### 只想获取目标数据中的指定字段

比如我们只想查看数据中的 `category` 字段

![](https://pic.imgdb.cn/item/6122188a4907e2d39cc6f603.jpg)

### 排序

按照price字段，倒序输出

![](https://pic.imgdb.cn/item/61221a594907e2d39cca1388.jpg)

### 多个组合条件查询

关键是请求体参数怎么写：

***And条件***

must 表示多个条件之间的 and 并且关系

```json
{
    "query": {
        "bool": {
            "must": [
                {
                    "match": {
                        "category": "小米"
                    }
                },
                {
                    "match": {
                        "price": 3999.00
                    }
                }
            ]
        }
    }
}
```

![](https://pic.imgdb.cn/item/61221d064907e2d39cce953a.jpg)

***Or条件***

should用来表示多个条件之间 or 的关系

```json
{
    "query": {
        "bool": {
            "should": [
                {
                    "match": {
                        "price": "4999.00"
                    }
                },
                {
                    "match": {
                        "price": 3999.00
                    }
                }
            ]
        }
    }
}
```

![](https://pic.imgdb.cn/item/612237c04907e2d39cf8ccd0.jpg)

***范围条件过滤***

比如想查询 price 大于 4000 的手机，这时候就得用 `filter` 了。

```json
{
    "query": {
        "bool": {
            "should": [
                {
                    "match": {
                        "price": "4999.00"
                    }
                },
                {
                    "match": {
                        "price": 3999.00
                    }
                }
            ],
            "filter": {
                "range": {
                    "price": {
                        "gt": 4000
                    }
                }
            }
        }
    }
}
```

![](https://pic.imgdb.cn/item/612238b94907e2d39cfa30f3.jpg)

### 精确匹配

使用 `match_phrase`，就不会被分词，只会精确匹配符合这个字符串的内容。

### 高亮显示

```json
{
    "query": {
        "match_phrase": {
            "category": "小米"
        }
    },
    "highlight": {
        "fields": {
            "category": {}
        }
    }
}
```

以上就是设置 category 高亮显示。

### 聚合查询

`aggs` 表示的就是 聚合操作。

`terms` 表示分组操作。

***分组***

```json
{
    "aggs": {
        // 表示要进行聚合操作
        "price_group": {
            // 名称，随意起名
            "terms": {
                // 表示要进行分组操作
                "field": "price"
                // 分组字段
            }
        }
    }
}
```

![](https://pic.imgdb.cn/item/61223bc24907e2d39cfea6f7.jpg)

***平均值***

```json
{
    "aggs": {
        // 表示要进行聚合操作
        "price_avg": {
            // 名称，随意起名
            "avg": {
                // 平均值
                "field": "price"
                // 分组字段
            }
        }
    },
    "size": 0
    // 这个参数表示去掉原始数据，只显示聚合后的结果，上面的分组中也可以加入这个参数，也可不加
}
```

![](https://pic.imgdb.cn/item/61223d734907e2d39c016b27.jpg)

### 映射关系

接下来，我们先创建一个 user 的索引：

执行 PUT请求  http://localhost:9200/user/

![](https://pic.imgdb.cn/item/61223ffe4907e2d39c04b7bb.jpg)

然后，我们发起 PUT 请求时通过 `_mapping` 表示需要自定义 user 里面的字段映射关系，具体的映射关系需要在 请求体中给出：

```json
{
    "properties": {
        "name": {
            "type": "text",
            "index": true
            // 这个index表示该字段可以被索引查询的
        },
        "sex": {
            "type": "keyword",
            // 这个keyword表示，该字段不能进行分词，必须完整匹配
            "index": true
        },
        "tel": {
            "type": "keyword",
            "index": false
            // 表示它不能被索引
        }
    }
}
```

![](https://pic.imgdb.cn/item/6122408c4907e2d39c058f9c.jpg)

我们来添加三条数据：

PUT    http://localhost:9200/user/_create/1001

PUT    http://localhost:9200/user/_create/1002

PUT    http://localhost:9200/user/_create/1003

```json
{
    "name": "小花",
    "sex": "女",
    "tel": "18298377557"
}
```

接下来我们查询一下数据，发现当我们输入 名字是 '小' 时，是支持分词查询的，出现了两条数据：

![](https://pic.imgdb.cn/item/612243004907e2d39c097dcd.jpg)

接下来我们试一下 sex字段，因为上面设置过 sex字段是 `keyword` 表示不支持分词，只能精确匹配，所以 sex字段必须是 完全精确匹配。

但是当我们查询 tel 字段时，发现如下错误：

![](https://pic.imgdb.cn/item/612243fd4907e2d39c0b1b11.jpg)

原因就是因为 tel 设置了不支持索引。

---

ElasticSearch 配套的 JavaAPI demo 地址：

[es-java-api (github.com)](https://github.com/guyuexuan039/es-java-api)

