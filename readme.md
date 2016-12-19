该组件实现了级联日期下拉框的功能，即选择完'年'后才能选'月'，选择了'月'后才能选择'日'。

## 使用说明
`js/cascadingdate.js`为未压缩文件, `build/cascading.min.js`为压缩后的文件。

### AMD
```js
require(['cascadingdate'], function(cascadingdate) {
    cascadingdate(container, options);
});
```
### 用`<script>`标签引入

```js
<script scr="cascadingdate.min.js"></script>
<script>
    cascadingdate(container, options);
</script>
```
## 参数说明

### container
承载该日期组件的dom元素。

### options
选项参数，包括以下可选项：

#### maxYear
可显示的最大年份，默认值为当前年份往后推50年，请传入数字例如`2016`。

#### minYear
可现实的最小年份，默认值为`1949`。

#### monthRange
月份的显示范围，传入数组，例如`[2, 10]`， 默认是`[1, 12]`。

#### maxDay
可显示的日期最大值，默认为当前月的最后一天，请传入数字。

#### minDay
可显示的最小日期，默认为`1`，请传入数字。

#### maxDate
为`Date`对象，会替换`maxYear`、`monthRange[1]`和`maxDay`为`Date`对象所对应的值。默认为`null`。

#### minDate
为`Date`对象，会替换`minYear`、`monthRange[0]`和`minDay`为`Date`对象所对应的值。默认为`null`。

#### yearSuffix
默认为空字符串，如果想显示`2016年`，请传入字符串`'年'`。

#### i18n
月份显示的文本值，默认是单纯的数字。

#### currentDate
组件生成时的显示时间，默认为空。请传入一个Date对象。

#### blank_text
未做选择时的选项文本值，年、月、日三个下拉框均为`'请选择'`，请传入数组进行更改，例如`['年', '月', '日']`

#### style_prefix
组件样式前缀，默认是`cascading_`。

## 返回值

一个对象：

```
{
    getDate,
    setDefaultDate
}
```
### getDate()

返回值，各下拉框当前所选取的值：

```js
{
    year,
    month,
    date
}
```
未选择的下拉框对应的值为`''`.

### setDefaultDate(edge)

如果只选定年，设置月和日的值; 只选定了年和月，设置日的值。`edge`请传入以下两种值：

- `'start'`

设置月、日为当前可选择的最早日期。

- `'end'`

设置月、日为当前可选择的最晚日期。
