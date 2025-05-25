---
id: MySQL函数、存储过程、索引学习
title: MySQL函数、存储过程、索引学习
tags: [个人博客]
---


***在自己的个人项目中，我们可能会需要在表中随机生成一些数据以供我们进行相应的测试。这时候就可以通过存储过程来向表中添加规定条数的数据。***

## 自定义函数
### 生成随机字符串
下面以一个自动生成由26个字母+10个数字的字符串函数为例来说明怎么写：
```sql
-- 如果该函数 generate_rand_string 已存在，则先删除
drop function if exists `generate_rand_string`;
-- 创建函数 generate_rand_string
create
	function `generate_rand_string`(n int)
	returns varchar(255)
	comment '测试自定义函数'
begin
	declare chars_str varchar(255) default 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; # 声明定义1个变量, 初值默认为 26个字母+10个数字
	declare return_str varchar(255) default ''; # 声明一个变量，用于设置返回的目标字符串
	declare i int default 0;
	while i < n do
		set return_str = concat(return_str, substring(chars_str,FLOOR(1 + RAND()*62), 1));
		set i = i + 1;
		end while;
	return (return_str);
end;

-- 调用 generate_rand_string 自定义函数
select `generate_rand_string`(10);
```

执行结果如下：
![](https://pic.imgdb.cn/item/61823bbd2ab3f51d913592a7.jpg)

#### 报错解决
如果在上面的创建自定义函数过程中，执行后报如下错误：
`This function has none of DETERMINISTIC, NO SQL, or READS SQL DATA in its declaration and binary logging is enabled (you *might* want to use the less safe log_bin_trust_function_creators variable)`，只需要执行下面这条SQL即可：

```sql
-- 报错设置
set global log_bin_trust_function_creators=1;
```

### 表间数据复制
需求：将A表中某行数据复制后再插入表中，并返回新增主键id。

```sql
-- 需求：将A表中某行数据复制后再插入表中，并返回新增主键id。
-- 如果该函数 copy_insert 已存在，则先删除
drop function if exists `copy_insert`;
-- 创建函数 copy_insert，返回新增数据行的=主键id
create
	function `copy_insert`(arg int)
	returns int
	comment '将A表中某行数据复制后再插入表中的函数'
begin
	declare result int; # 声明返回结果 int型的result，注意自定义函数必须有且只能有一个返回值
	declare id_tmp int; # 查询到的id
	declare username_tmp varchar(255); # 查询结果 username
	declare nickname_tmp varchar(255);
	declare password_tmp varchar(255);
	declare status_tmp int;
	declare email_tmp varchar(64);
	declare userface_tmp varchar(255);
	declare regtime_tmp varchar(255);
	select id,username,nickname,`password`,`status`,email,userface,regtime into id_tmp,username_tmp,nickname_tmp,password_tmp,status_tmp,email_tmp,userface_tmp,regtime_tmp from user where id = arg;
	set id_tmp := id_tmp + 1; # id自增1 # 使用set语句, := 操作符赋值
	set result := id_tmp; # 返回新增数据的id
	insert into user values(id_tmp,username_tmp,nickname_tmp,password_tmp,status_tmp,email_tmp,userface_tmp,regtime_tmp);
	return result;
end;

-- 调用
select copy_insert(20);
```

![](https://pic.imgdb.cn/item/6182446a2ab3f51d914137ea.jpg)
![](https://pic.imgdb.cn/item/61824b9a2ab3f51d914a4b7a.jpg)


### 查看函数状态

```sql
-- 查看 copy_insert 函数状态
show function status like '%copy_insert%';
```

![](https://pic.imgdb.cn/item/618245452ab3f51d914279f8.jpg)

### 查看函数定义

```sql
-- 查看 copy_insert 函数定义
show create function copy_insert;
```

![](https://pic.imgdb.cn/item/618245982ab3f51d9142e08e.jpg)



## 存储过程

> 需求：向user表中插入10w条数据，完成测试数据的生成，在生成某列字段时采取调用之前自定义函数 generate_rand_string 生成的字符串来填充。

```sql
-- 新建存储过程 insert_data
-- 向表中插入10w条数据，同时调用之前自定义函数 generate_rand_string
-- 如果该存储函数存在，则先删除
drop procedure if exists insert_data;
create procedure insert_data(row_arg int, start_id int) # 并设置两个参数
	begin
		declare i int;
		set i = start_id; # 因为我表中已经有数据了，所以这里id从50开始
		while i <= row_arg do
			insert into user(id, username, nickname, `password`, `status`, email, userface, regTime) values(i, '', '', '', 1, '', generate_rand_string(10), null); # 注意这里调用了之前自定义过的函数 generate_rand_string
			set i = i + 1;
		end while;
	end;
-- 	调用 insert_data 存储过程，并传入参数，插入100条数据，id从50开始
call insert_data(100, 50);
```

![](https://pic.imgdb.cn/item/61824cec2ab3f51d914bbc0f.jpg)

### 存储过程调用

```sql
call insert_data(100, 50);
```

> 通过这种方式，我们可以向一张表中插入百万数据用例。


## 索引

### 索引类型
> 以MySQL为例，索引从是否可重复来说分为：唯一索引（unique，注意：primary只是一种特殊的unique索引）和普通索引。
> 从索引列来说分为：单列索引和多列组合索引；多列组合索引遵从“从左原则”，即从左开始匹配使用索引。

### 索引的数据结构
> 索引是一种数据结构，例如B-Tree，这种数据结构是需要额外的写入和存储为代价来提高表上数据检索的速度。一旦建立了索引后，数据库中查询优化器使用索引来快速定位数据，然后就无需扫描表中给定查询的每一行了。
> 其中。当使用主键或唯一键创建表时，MySQL会自动创建名为PRIMARY的特殊索引, 该索引称为聚簇索引。PRIMARY索引是比较特殊的，这个索引本身与数据一起存储在同一个表中。另外除PRIMARY索引之外的其他索引称为二级索引或非聚簇索引。

默认情况下，如果未指定索引类型，MySQL将创建B-Tree索引。 以下显示了基于表的存储引擎的允许索引类型：

| Storage Engine | Allowed Index Types |
| -------------- | ------------------- |
| InnoDB         | BTREE               |
| MyISAM         | BTREE               |
| Memory/Heap    | Hash, BTREE         |




> 原始表数据

![](https://pic.imgdb.cn/item/618256012ab3f51d91561dd8.jpg)

### 未加索引时

```sql
-- username 未添加索引时，查找 username = 'renwoxing' 的数据
explain select id,username,nickname,password,status,email,userface,regtime from user where username='renwoxing';
```

> 执行计划：

![](https://pic.imgdb.cn/item/618254f72ab3f51d9154f18e.jpg)

### 添加索引

```sql
-- 现在使用CREATE INDEX语句为 username 列创建一个普通索引：
create index idx_username on user(username);
```

再次执行上面的select语句，查看执行计划：
![](https://pic.imgdb.cn/item/618257172ab3f51d91576012.jpg)

> 这时候看到MySQL只扫描了1行（当然这里只是巧合是1行，添加索引后只是扫描行减少了，并不是都是1行），而不是像之前那样扫描那么多行数据。

### 查看某张表的所有索引

```sql
show indexes from user;
```

![](https://pic.imgdb.cn/item/618258e12ab3f51d9159c3ea.jpg)

> 注意看 `Index_type` 列，索引列使用的正是 BTREE 索引。`Non_unique` ：如果索引不能包括重复值则为0，如果可以则为1。也就是平时所说的唯一索引，也就是说0表示是唯一索引，1表示普通索引。

### 组合索引

```sql
-- 组合索引
create index idx_username_nickname_status on user(username, nickname, status);
```

再次查看user表中的索引：
```sql
show indexes from user;
```

![](https://pic.imgdb.cn/item/61825e522ab3f51d916164cf.jpg)

> 注意：当某个字段即创建了单列索引，又在组合索引中也涉及到了该字段，那么当在 where 条件中即使对 组合索引 字段都进行了设置（并且符合从左原则，即组合索引必须有最左侧的字段的条件），但是也不会走 多列组合索引。自己可以测试一下，这里我已经删除了 username 的单列索引，就不演示了。

 多列索引查询，查看执行计划
 ```sql
 -- 对组合索引字段执行查询操作
explain select id,username,nickname,password,status,email,userface,regtime from user where nickname = '任我行';
```

![](https://pic.imgdb.cn/item/618262ce2ab3f51d9168ab21.jpg)

可以看到在上面的查询中，即使 nickname 字段是组合索引中的字段，但是查询时并没有走索引，什么原因呢？原因就是上述查询不符合“从左原则”，请看下面的正确查询：
```sql
-- 对组合索引字段执行查询时，必须要有最左侧字段的条件判断（必须是等值判断，若是like模糊匹配，则不会走索引），
explain select id,username,nickname,password,status,email,userface,regtime from user where nickname = '任我行' and username='renwoxing';
```

![](https://pic.imgdb.cn/item/6182635d2ab3f51d916a1bef.jpg)

> 对组合索引字段执行查询时，必须要有最左侧字段的条件判断（必须是等值判断，若是like模糊匹配，则不会走索引），此时才会走索引（不论其它字段是否都存在，或者只存在其一）。





***本文参考于：[MySQL之自定义函数](https://zhuanlan.zhihu.com/p/128744140)、[索引(三)Mysql创建索引](https://zhuanlan.zhihu.com/p/76925792)、[索引(一)Mysql创建索引](https://zhuanlan.zhihu.com/p/76926803)***
