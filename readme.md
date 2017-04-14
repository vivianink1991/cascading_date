该组件实现了级联日期下拉框的功能，即选择完'年'后才能选'月'，选择了'月'后才能选择'日'。[查看样例](https://vivianink1991.github.io/cascading_date/example/test_build.html)

## 使用说明

``` html
<div id="cascading_wrap">
    <select name="year" class="year"></select> 年 -
    <select name="month" class="month"></select> 月 -
    <select name="date" class="date"></select> 日
</div>
```
<em>注意：组件渲染的月份下拉框的值是其`文本值 - 1`，即`value="1"`表示2月。这与`Date`对象返回的`getMonth()`值一致。</em>

### AMD
```js
require(['cascadingdate'], function(cascadingdate) {
    cascadingdate(container, options);
});
```
### 或使用`<script>`标签引入

```js
<script scr="cascadingdate.min.js"></script>
<script>
    cascadingdate(container, options);
</script>
```
## 参数说明

### container
承载该日期组件的dom元素选择器。

### options
选项参数，包括以下选项：

### selectedBoxes
数组，包括年、月、日三个元件的CSS选择器，必选。

#### maxYear
可显示的最大年份，默认值为当前年份往后推50年，请传入数字例如`2016`。

#### minYear
可现实的最小年份，默认值为`1949`。

#### monthRange
月份的显示范围，表示每年的可选月份范围。传入数组，例如`[2, 10]`， 默认是`[1, 12]`。

#### maxDay
可显示的日期最大值，设置后表示每月可选的最大日期。默认为当前月的最后一天，请传入数字。

#### minDay
可显示的最小日期，设置后表示每月可选的最小日期。默认为`1`，请传入数字。

#### maxDate
`Date`对象，可选的最小日期。默认为`null`。

#### minDate
`Date`对象，可选的最大日期。默认为`null`。

#### defaultDate
组件生成时的显示时间，默认为空。请传入一个Date对象。

#### yearSuffix
默认为空字符串，如果想显示`2016年`，请传入字符串`'年'`。

#### i18n
月份语言本地化，默认为纯数字。传入数组如`['January',...]`。

#### daySuffix
默认为空字符串，如果想显示`1号`，请传入字符串`'号'`。

#### blank_text
未做选择时的选项文本值，年、月、日三个下拉框均为`'请选择'`，请传入数组进行更改，例如`['年', '月', '日']`

## 返回值

一个对象：

```
{
    getDate,
}
```
### getDate()

返回值，各下拉框当前所选取的值：

```js
{
    year,
    month,
    day
}
```
未选择的下拉框对应的值为`''`.