
![](https://img.imgdb.cn/item/604b7e335aedab222ce6192e.jpg)

# HSSFWorkbook 介绍
---
开发中经常会遇到 Excel 的处理，在 Java 中，操作 excel 目前有两个主流框架，分别是：
* apache 的 poi

> Apache POI [1]  是用Java编写的免费开源的跨平台的 Java API，Apache POI提供API给Java程式对Microsoft Office格式档案读和写的功能。POI为“Poor Obfuscation Implementation”的首字母缩写，意为“简洁版的模糊实现”。

* Java Excel

> Java Excel是一开放源码项目，通过它Java开发人员可以读取Excel文件的内容、创建新的Excel文件、更新已经存在的Excel文件。jxl 由于其小巧 易用的特点, 逐渐已经取代了 POI-excel的地位, 成为了越来越多的java开发人员生成excel文件的首选

这里提一下：HSSFWorkbook:是操作Excel2003以前（包括2003）的版本，扩展名是.xls；XSSFWorkbook:是操作Excel2007的版本，扩展名是.xlsx。对于不同版本的EXCEL文档要使用不同的工具类，如果使用错了，会提示如下错误信息：org.apache.poi.openxml4j.exceptions.InvalidOperationException，org.apache.poi.poifs.filesystem.OfficeXmlFileException

![](https://img.imgdb.cn/item/604b7e335aedab222ce61937.jpg)

# HSSFWorkbook 的使用
---

```java
package com.knowledge.point;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.Font;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author: latinos-bub
 * @date: 2019/11/12 17:32
 * @description: 测试生成 excel
 * @className: com.knowledge.point.TestGenExcel
 */
public class TestGenExcel {

    public static void main(String[] args) throws Exception{

        // 创建一个 excel 工作簿
        HSSFWorkbook workbook = new HSSFWorkbook();

        // 创建一个 excel 里面的 sheet 表格，并设置 sheet 名字
        HSSFSheet sheet = workbook.createSheet("测试生成 excel 表格是否乱码");

        // -------------------------------设置 工作簿的 样式 start--------------------------//
        HSSFCellStyle titleStyle  = workbook.createCellStyle(); // 创建标题样式
        titleStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);    // 设置标题水平居中显示
        titleStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER); // 设置标题垂直居中显示
        HSSFFont titleFont = workbook.createFont();    // 创建标题字体
        titleFont.setItalic(false);                     // 设置字体为斜体字
        titleFont.setColor(Font.COLOR_RED);            // 将字体设置为“红色”
        titleFont.setFontHeightInPoints((short)16);    // 将字体大小设置为18px
        titleFont.setFontName("宋体");             // 将“宋体”字体应用到当前单元格上
        titleFont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);    //加粗
        titleStyle.setFont(titleFont); // 将 字体应用到 标题样式上

        HSSFCellStyle cellStyle  = workbook.createCellStyle();  // 创建 cell 单元格样式
        cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 设置 cell 单元格水平居中显示
        cellStyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);  // 设置 cell 单元格垂直居中显示
        Font cellFont = workbook.createFont();  // 创建 单元格 字体
        cellFont.setFontHeightInPoints((short)10);    // 将字体大小设置为18px
        cellFont.setFontName("宋体");             // 字体应用到当前单元格上
        cellStyle.setFont(cellFont); // 将 字体应用到 单元格样式上
        // -------------------------------设置 工作簿的 样式 end--------------------------//



        // 创建 首行(即标题 行)
        HSSFRow headRow = sheet.createRow(0);
        // 创建 首行(即标题 行) 的 第一个单元格
        HSSFCell headCell = headRow.createCell(0);
        // 设置 首行(即标题 行)的文字内容
        headCell.setCellValue("更新时间");
        headCell.setCellStyle(titleStyle); // 设置 首行的 第一个单元格 样式
        // 创建 首行(即标题 行) 的 第二个单元格
        headCell = headRow.createCell(1);
        headCell.setCellValue("创建时间");
        headCell.setCellStyle(titleStyle);  // 这里一定要每次实例化之后都要设置样式
        headCell = headRow.createCell(2);
        headCell.setCellValue("删除状态");
        headCell.setCellStyle(titleStyle); // 这里一定要每次实例化之后都要设置样式
        headCell = headRow.createCell(3);
        headCell.setCellValue("id");
        headCell.setCellStyle(titleStyle); // 这里一定要每次实例化之后都要设置样式
        headCell = headRow.createCell(4);
        headCell.setCellValue("书名");
        headCell.setCellStyle(titleStyle); // 这里一定要每次实例化之后都要设置样式


        // 获取 模拟的 List<Map<String, Object> 数据
        List<Map<String, Object>> list = getList();

        for (int i = 0; i < list.size(); i++){  // 外层for是每一行的设置
            // 每一行(填充的内容行)时，我们都要新实例化一个 HSSRow 新行
            HSSFRow contentRow = sheet.createRow(sheet.getLastRowNum() + 1);    // 调用sheet的上次最后一行索引 + 1即可
            for (int j = 0; j < 5; j++){    // 内层 for 是 每行的 列数设置，因为我们的标题行有5列，所以这里设置5列
                // 每一行，我们都要在该行(即contentRow) 实例化 5 个 cell 单元格
                HSSFCell contentCell = contentRow.createCell(j);
                switch (j){ // 1，2，3，4，5个单元格分别写入自己正确的数据
                    case 0: // 每一行的第一列(即第一个cell)我们都写入 update_time 对应的数据，以下依次类推
                        contentCell.setCellValue(String.valueOf(list.get(i).get("update_time")));
                        break;
                    case 1:
                        contentCell.setCellValue(String.valueOf(list.get(i).get("create_time")));
                        break;
                    case 2:
                        contentCell.setCellValue(String.valueOf(list.get(i).get("delete_status")));
                        break;
                    case 3:
                        contentCell.setCellValue(String.valueOf(list.get(i).get("id")));
                        break;
                    case 4:
                        contentCell.setCellValue(String.valueOf(list.get(i).get("content")));
                        break;
                }
                // 设置 内容 居中显示 样式
                contentCell.setCellStyle(cellStyle);
            }
        }

        // 设置 列 的宽度
        sheet.setColumnWidth(0, 900 * 10);
        sheet.setColumnWidth(1, 900 * 10);
        sheet.setColumnWidth(2, 900 * 10);
        sheet.setColumnWidth(3, 900 * 10);
        sheet.setColumnWidth(4, 900 * 10);


        File xlsFile = new File("测试生成Excel.xls");
        workbook.write(new FileOutputStream(xlsFile));
        workbook.close();


        // 补充：如果是 web 程序，需要页面打开一个对话框，保存文件则，需要额外添加以下代码即可
        /*String fileName = "excel表";
        fileName = new String(fileName.getBytes(), "ISO-8859-1");
        HttpServletResponse response = this.getResponse().getHttpResponse();
        response.setHeader("Content-disposition", "attachment; filename=" + fileName + ".xls");
        response.setContentType("application/application/vnd.ms-excel;charset=utf-8");
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        // workbook 工作簿中写入数据
        workbook.write(byteArrayOutputStream);
        byte[] content = byteArrayOutputStream.toByteArray();
        InputStream inputStream = new ByteArrayInputStream(content);
        ServletOutputStream out = null;
        try {
            out = response.getOutputStream();
            byte[] b = new byte[2048];  // 设置 缓冲区的读取字节大小
            int i;
            while ((i = inputStream.read(b)) > 0) {
                out.write(b, 0, i);
            }
            out.flush();
        } catch (Exception e) {
            System.out.println("生成excel表格时出错: " + e.getMessage());
        } finally {
            if (inputStream != null)
                inputStream.close();
            if (out != null)
                out.close();
        }*/
    }




    /**
    * @Author latinos-bub
    * @Description //TODO   这里我先准备一个从别的地方获取的 sql 结果集合，以备下面写入数据使用
     * 这个 List 中我们就存放 12 个 Map 即可(模拟数据)
    * @Date 2019/11/12 21:17
    * @Param []
    * @return java.util.List<java.util.Map<java.lang.String,java.lang.Object>>
    **/
    private static List<Map<String, Object>> getList(){

        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("update_time", "1569404166000");
        map1.put("create_time", "1569404122000");
        map1.put("delete_status", "1");
        map1.put("id", "2");
        map1.put("content", "如何削铁");
        list.add(map1);

        Map<String, Object> map2 = new HashMap<String, Object>();
        map2.put("update_time", "1509357581000");
        map2.put("create_time", "1508893725000");
        map2.put("delete_status", "1");
        map2.put("id", "5");
        map2.put("content", "莎士比亚");
        list.add(map2);

        Map<String, Object> map3 = new HashMap<String, Object>();
        map3.put("update_time", "1510970055000");
        map3.put("create_time", "1508986168000");
        map3.put("delete_status", "1");
        map3.put("id", "6");
        map3.put("content", "亚里士多德");
        list.add(map3);


        Map<String, Object> map4 = new HashMap<String, Object>();
        map4.put("update_time", "1510118932000");
        map4.put("create_time", "1509001065000");
        map4.put("delete_status", "1");
        map4.put("id", "10");
        map4.put("content", "亚历山大");
        list.add(map4);


        Map<String, Object> map5 = new HashMap<String, Object>();
        map5.put("update_time", "1509002622000");
        map5.put("create_time", "1509002622000");
        map5.put("delete_status", "0");
        map5.put("id", "11");
        map5.put("content", "李白");
        list.add(map5);


        Map<String, Object> map6 = new HashMap<String, Object>();
        map6.put("update_time", "1569376168000");
        map6.put("create_time", "1569404290000");
        map6.put("delete_status", "1");
        map6.put("id", "12");
        map6.put("content", "无用是什么");
        list.add(map6);

        Map<String, Object> map7 = new HashMap<String, Object>();
        map7.put("update_time", "1569376160000");
        map7.put("create_time", "1569404290000");
        map7.put("delete_status", "0");
        map7.put("id", "13");
        map7.put("content", "选择吃什么饭是一件很痛苦的事");
        list.add(map7);

        Map<String, Object> map8 = new HashMap<String, Object>();
        map8.put("update_time", "1510983431000");
        map8.put("create_time", "1510983427000");
        map8.put("delete_status", "1");
        map8.put("id", "19");
        map8.put("content", "文章test2");
        list.add(map8);

        Map<String, Object> map9 = new HashMap<String, Object>();
        map9.put("update_time", "1569376164000");
        map9.put("create_time", "1569404290000");
        map9.put("delete_status", "1");
        map9.put("id", "20");
        map9.put("content", "就像选择在哪里睡觉一样");
        list.add(map9);

        Map<String, Object> map10 = new HashMap<String, Object>();
        map10.put("update_time", "1569376166000");
        map10.put("create_time", "1569404290000");
        map10.put("delete_status", "1");
        map10.put("id", "21");
        map10.put("content", "effective of java");
        list.add(map10);

        Map<String, Object> map11 = new HashMap<String, Object>();
        map11.put("update_time", "1569376172000");
        map11.put("create_time", "1569404290000");
        map11.put("delete_status", "1");
        map11.put("id", "22");
        map11.put("content", "荒岛求生");
        list.add(map11);

        Map<String, Object> map12 = new HashMap<String, Object>();
        map12.put("update_time", "1569376170000");
        map12.put("create_time", "1569404290000");
        map12.put("delete_status", "0");
        map12.put("id", "23");
        map12.put("content", "天使永远就在身边");
        list.add(map12);

        return list;
    }
}

```

------

![](https://img.imgdb.cn/item/604b7e335aedab222ce61945.jpg)

<div align="middle">《行香子·归去来兮》
	-- 北宋：辛弃疾
</div>
> 归去来兮，行乐休迟。命由天、富贵何时。
百年光景，七十者稀。奈一番愁，一番病，一番衰。
名利奔驰，宠辱惊疑。旧家时、都有些儿。
而今老矣，识破关机。算不如闲，不如醉，不如痴。
