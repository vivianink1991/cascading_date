该组件实现了级联日期下拉框的功能，即选择完'年'后才能选'月'，选择了'月'后才能选择'日'。

##使用说明

```
import 'cascadingdate';
cascadingdate(container, options);
```

##参数说明

###container
承载该日期组件的dom元素。

### options
选项参数，包括以下可选项：

#### maxYear
可显示的最大年份，默认值为当前年份往后推50年，请传入数字例如`2016`。

#### minYear
可现实的最小年份，默认值为`1949`。

#### monthRange
月份的显示范围，传入数组，例如`[2, 10]`， 默认是`[1, 12]`。

#### maxDate
可显示的日期最大值，默认为当前月的最后一天，请传入数字或`Date`对象。

#### minDate
可显示的最小日期，默认为`1`，请传入数字或`Date`对象。

#### style_prefix
组件样式前缀，默认是`date`。

