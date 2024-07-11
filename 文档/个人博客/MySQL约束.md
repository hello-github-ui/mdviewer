---
title: MySQL约束
cover: 'https://img.imgdb.cn/item/604b88715aedab222cebf608.jpg'
categories:
  - code
tags:
  - MySQL
abbrlink: 9528
date: 2019-04-26 16:54:23
---

# 约束的定义

约束用于规定表中的数据规则，保证表中的记录的完整和有效。如果存在违反约束的数据行为，行为会被约束终止，约束可以在创建表时规定(通过 create table 语句)，或者在表创建之后规定(通过 alter table 语句)

# 约束种类

* 非空约束（not null）
* 唯一性约束（unique）
* 主键约束（primary key）
* 外键约束（foreign key）
* 检查约束（check 适用于 Oracle）
* 缺省约束（default）

*注意：约束有上面的6种，但是这些约束还有：**表级约束**和**列级约束**的划分*

**列级约束**：包含在列定义中，直接跟在该列的定义之后，用 `空格` 分割；不必指定列名。是对某一个特定列的约束，有五种：主键、唯一、检查、默认、非空，即*除了外键约束外*，所有约束都有列级约束的表现形式

**表级约束**：与列级约束的定义相互独立，不包含在列级约束中；通常用于对多个列一起进行约束，约束与定义之间用 `,` 分割；必须指出要约束的列的名称。用于对多个列一起进行约束，有四种：主键、外键、唯一、检查（巧记：非空约束和缺省约束没有表级约束的表现形式）

而每一种约束又有**单一约束**和**联合约束**之分，比如我们常见的非空约束，既可以只约束一个字段，也可以同时约束多个字段

## 非空约束

创建表，给字段添加非空约束

```mysql
// 非空约束的列级约束表现形式
create table t_user(
	id int(3),
    name varchar(255) not null
);
// 注意：非空约束没有表级约束，只有列级约束，所以这里只给出了列级约束的例子
```

插入数据时如果没有插入 name 字段的数据，则会报错



## 唯一性约束

使用 unique 约束的字段，具有唯一性，不可以重复，但是可以为 null

```mysql
// 唯一性约束的列级约束表现形式
create table t_user(
	id int(3),
    name varchar(255) not null,
    email varchar(255) unique
);

// 唯一性约束的表级约束表现形式
create table t_user(
	id int(3),
    name varchar(255) not null,
    email varchar(255),
    unique(email)
);
```

如果有两条检录插入相同的 email 值，则会报错
```mysql
mysql> insert into t_user(id,name,email) values(1,'xlj','932834897@qq.com');
Query OK, 1 row affected (0.00 sec)

mysql> insert into t_user(id,name,email) values(2,'jay','932834897@qq.com');
ERROR 1062 (23000): Duplicate entry '932834897@qq.com' for key 'email'

```

拓展：在实际开发中有时候可能会有注册用户时用户名不能重复的需求，这时候我们就可以通过唯一性约束来实现，而不必非要通过后端的逻辑去实现

上面的例子都是单一约束，我们再来看一下唯一性约束的联合约束的表现形式，联合约束多见于表级约束：

联合约束意为如果两条记录中，所定义的联合约束的字段的值都相同，则报错

```mysql
// 唯一性约束的联合约束形式
create table t_user(
	id int(3),
    name varchar(255) not null,
    email varchar(255),
    unique(name, email)
);

// 插入第一条数据
mysql> insert into t_user(id,name,email) values(1,'xxx','qq.com');
Query OK, 1 row affected (0.05 sec)

// 插入第二条数据，如果只是与联合约束中的某一个字段相同，并不会报错
mysql> insert into t_user(id,name,email) values(2,'mmm','qq.com');
Query OK, 1 row affected (0.05 sec)

// 如果是插入的记录中的两个联合约束的字段都与已存在的记录相同，则报错
mysql> insert into t_user(id,name,email) values(3,'mmm','qq.com');
ERROR 1062 (23000): Duplicate entry 'mmm-qq.com' for key 'name'


```

表级约束可以使用关键字 `constraint` 起名字，方便之后删除该约束

```mysql
create table t_user(
	id int(3),
    name varchar(255) not null,
    email varchar(255),
    constraint t_user_name_email_unique unique(name, email)
);
// 格式: constraint 该约束起的名 约束()
```

## 主键约束

主键约束和 `not null unique` 的区别：给某个字段添加主键约束之后，该字段不能重复也不能为空，其表现效果上和 `not null unique` 相同，但二者的本质不同。因为主键约束还会默认添加为 索引 --index

主键呢又有 单一主键和复合主键之分，但是无论是单一主键还是复合主键，一张表的主键约束却只能有一个（只能有一个主键约束），但是可以作用于多个字段

单一主键：主键约束只作用于一个字段

复合主键：主键约束作用于多个字段（只能用于表级约束）

```mysql
// 单一主键（列级定义）
mysql> create table t_user(
    -> id int(10) primary key,
    -> name varchar(32)
    -> );
Query OK, 0 rows affected (0.07 sec)


// 单一主键（表级定义）
mysql> create table t_user(
    -> id int(10),
    -> name varchar(32) not null,
    -> constraint t_user_id_pk primary key(id)
    -> );
Query OK, 0 rows affected (0.01 sec)

// 复合主键（标记定义）
mysql> create table t_user(
    -> id int(10),
    -> name varchar(32) not null,
    -> email varchar(128) unique,
    -> primary key(id,name)
    -> );
Query OK, 0 rows affected (0.05 sec)

```

在 MySql 中提供了一个自动生成主键值的功能，主键值不用用户自己维护，默认从1开始自动递增

## 外键约束

不常用，而且不建议使用

# 致谢

本文参考自[https://blog.csdn.net/w_linux/article/details/79655073](https://blog.csdn.net/w_linux/article/details/79655073)，有兴趣的可以查看
