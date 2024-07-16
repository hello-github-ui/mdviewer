
# Mybatis 中 ResultMap 的使用

> 最关键的是明白 resultMap 的两个最重要的作用：
>
> *-1* ：当你在 select 中，`resultType`  是一个 Entity(或 Model等 pojo 时)，如果你的 sql 结果集字段与你的 `pojo` 属性名不一致时，这时可以通过 `resultMap` 起到 重新映射成你 `pojo` 中名字的结果集
>
> *-2* :  第二个作用应该是使用量最多的一种，就是涉及到多对一的结果集映射或者一对多的结果集映射时



##  先说一下 resultMap 中 的 association 和 collection 的区别

> `association` 用于 `一对一` 和 `多对一`的情况
>
> `collection` 用于 `一对一`  和 `一对多` 的情况



### 举例如下

```xml
<!--created by util.you.com@gmail.com search-->
    <select id="search" parameterType="java.util.Map" resultMap="reFundList">
        SELECT
            csr.id,
            csr.strategy_name,
            csr.remark,
            csr.`status`,
            sut.username,
            DATE_FORMAT(IFNULL(csr.insert_time, ''), '%Y-%m-%d %H:%i:%s') AS insert_time
        FROM
            `CL_STRATEGY_REFUND` AS csr
        LEFT JOIN
            `SYS_USER_TBL` AS sut ON sut.user_id = csr.insert_user_id
        WHERE
            csr.`status` = 1
        <if test="strategyName != null and strategyName != ''">
            AND csr.strategy_name LIKE CONCAT('%',#{strategyName}, '%')
        </if>
            ORDER BY csr.id DESC
        <if test="offset != null and limit != null">
            limit #{offset}, #{limit}
        </if>
        ;
    </select>

    <!--created by util.you.com@gmail.com search 因为这里返回类型(即封装类型)是 Map，所以 property 的值就是 Map 封装的 key 名称-->
    <resultMap id="reFundList" type="java.util.Map">
        <id column="id" property="id"/>
        <result column="strategy_name" property="strategyName"/>
        <result column="remark" property="remark"/>
        <result column="username" property="userName"/>
        <result column="insert_time" property="insertTime"/>
        <collection property="ruleList" javaType="ArrayList" column="id" select="selectReFundInfo"/>
    </resultMap>

    <!--created by util.you.com@gmail.com search-->
    <select id="selectReFundInfo" parameterType="java.lang.Integer" resultType="java.util.Map">
        select
            csrr.id,
            csrr.strategy_id,
            csrr.time_limit,
            csrr.fee_type,
            csrr.fee_value
        from
            `CL_STRATEGY_REFUND_REL` as csrr
        where
            csrr.`status` = 1 and csrr.strategy_id = #{id}
    </select>



```

* 注意点请看下图 *

![](https://img.imgdb.cn/item/604b7f095aedab222ce691f9.png)
![](https://img.imgdb.cn/item/604b7f095aedab222ce691fd.png)



# 娱乐一下

![](https://img.imgdb.cn/item/604b7f095aedab222ce69201.jpg)
