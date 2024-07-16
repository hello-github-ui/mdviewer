
# MySQL 触发器

## 前言

这里呢，有两张表，分别是 `CXY_TS_ORDER_TICKET ` 和 `CXY_TS_ORDER_TICKET_STATUS` 表，在 `CXY_TS_ORDER_TICKET ` ` 表里面有一个 `get_status` 字段，现在呢，我们想在该字段发生变化时，在 `CXY_TS_ORDER_TICKET_STATUS` 表中，将该字段插入，并且记录变化时间以及发生变化的记录的主键。因此呢，我打算用触发器去实现这个需求

## 实现

```sql
-- Created by util.you.com@gmail.com
delimiter $$
CREATE TRIGGER `order_ticket_status_trigger` AFTER UPDATE
ON `CXY_TS_ORDER_TICKET` FOR EACH ROW
BEGIN
	DECLARE s1 INT(11); -- 声明变量，用于存入 CXY_TS_ORDER_TICKET 表的 get_status 字段值,id 字段值
	DECLARE s2 INT(11);
	set s2 = new.id; -- 分别给 s1 和 s2 赋值
	set s1 = new.get_status;
	IF((old.get_status != new.get_status) OR (old.get_status IS NULL && new.get_status IS NOT NULL)) THEN
		INSERT INTO `CXY_TS_ORDER_TICKET_STATUS`(`order_ticket_id`, `STATUS`, `insert_date_time`) VALUES(s2, s1, DATE_FORMAT(now(),'%Y-%m-%d %H:%i:%s'));
	END IF;
END$$
```

## 解释

> 在 mysql 中，`new`、`old`都是内置的，分别表示一个字段发生变化前、后的值（当然也包括插入操作前后的变化），此处呢，因为我们需要根据 `CXY_TS_ORDER_TICKET`表的 `get_status`字段来插入记录到 `CXY_TS_ORDER_TICKET_STATUS` 表，因此呢，new 和 old 都取该字段即可。
>
> `mysql` 中的触发器呢，大致分为三类：`insert` 型、`update` 型、`delete` 型。
>
> 何时触发该操作呢，又分为 `after`  和 `before` 型
>
> 上示例子，就是一个触发器的大致模板，根据哪一张表的变化来触发该触发器，就 `on` 这张表即可了。

![](https://img.imgdb.cn/item/604b7fef5aedab222ce7149a.jpg)
