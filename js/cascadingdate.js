(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.cascadingdate = factory();
    }
}(this, function() {

    function CascadingSet(container, options) {
        this.container = document.querySelector(container);

        this.config = extend({
            selectedBoxes: [],
            maxYear: (new Date).getFullYear() + 50,
            minYear: 1949,
            monthRange: [1, 12],
            dayRange: [1, null],
            maxDate: null,
            minDate: null,
            yearSuffix: '',
            i18n: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            daySuffix: '',
            defaultDate: null,
            blank_text: ['请选择', '请选择', '请选择']
        }, options || {});

        this.dateRangeArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        var _self = this.config;

        // 获取年、月、日DOM
        var selectors = _self.selectedBoxes;
        var boxes = ['yearBox', 'monthBox', 'dayBox'];
        for (var i = 0, len = boxes.length; i < len; i++) {
            this[boxes[i]] = this.container.querySelector(selectors[i]);
        }

        // 设置 最小年中可选的最小月份、日期，最大年中可选的最大月份
        var _minMonthRg =  _self.monthRange[0],
            _minDayRg = _self.dayRange[0];
        if (_self.minDate) {
            var minDate = parseDate(_self.minDate);
            _self.minDate = minDate;
            this.minMonth = Math.min(minDate.month, _minMonthR); //最小年的最小月份
            this.minDay = Math.min(minDate.day, _minDayRg); //可选的最小日期
        } else {
            this.minMonth = _minMonthRg;
            this.minDay = _minDayRg;
        }

        var _maxMonthRg =  _self.monthRange[1];
        if  (_self.maxDate) {
            var maxDate = parseDate(_self.maxDate);
            _self.maxDate = maxDate;
            this.maxMonth = Math.max(maxDate.month, _maxMonthRg);
        } else {
            this.maxMonth = _maxMonthRg;
        }

        // 解析 defaultDate
        if (_self.defaultDate) {

            _self.defaultDate = parseDate(_self.defaultDate);

            // 判断默认年份是不是闰年
            if (isLeapYear(_self.defaultDate.year)) {
                this.dateRangeArr[1] = 29;
            }
        }
    }

    CascadingSet.prototype = {

        _renderYear: function(current) {
            var  _self = this.config;

            this.yearBox.innerHTML = '<option value="">' + _self.blank_text[0] + '</option>';

            var isCurrent = false;
            for (var i =  _self.minYear; i <=  _self.maxYear; i++) {
                isCurrent = (i == current) ? true : false;
                this.yearBox.appendChild(createOption(i + _self.yearSuffix, i, isCurrent));
            }
        },

        _renderMonth: function(isDisable, current) { //current从1开始

            var  _self = this.config;

            this.monthBox.innerHTML = '<option value="">' + _self.blank_text[1] + '</option>';

            if (isDisable) {
                this.monthBox.setAttribute('disabled', true);
                return;
            }

            this.monthBox.removeAttribute('disabled');

            var currentYear = parseInt(this.yearBox.value),
                isCurrent = false;
            
            var _min = (currentYear ===  _self.minYear) ? this.minMonth : _self.monthRange[0],
                _max = (currentYear === _self.maxYear) ? this.maxMonth : _self.monthRange[1];
            
            for (var i =  _min; i <=  _max; i++) {
                if (!current) {
                    isCurrent = false;
                } else {
                    isCurrent = (i == current) ? true : false;  
                } 
                this.monthBox.appendChild(createOption(_self.i18n[i - 1], i - 1, isCurrent));
            }
        },

        _renderDay: function(isDisable, current) {
            var _self = this.config;

            this.dayBox.innerHTML = '<option value="">' + _self.blank_text[2] + '</option>';

            if (isDisable) {
                this.dayBox.setAttribute('disabled', true);
                return;
            }

            this.dayBox.removeAttribute('disabled');

            var currentYear = parseInt(this.yearBox.value),
                currentMonth = parseInt(this.monthBox.value) + 1;

            var _min = (currentYear === _self.minYear && currentMonth === _self.minMonth) ?
                          this.minDay : _self.dayRange[0];
            
            var _max;
            // 在最大年最大月
            if (currentYear === _self.maxYear && currentMonth === _self.maxMonth) {

                if (_self.dayRange[1] === null) {
                    _self.dayRange[1] = Number.MIN_VALUE;
                }

                if (_self.maxDate) {
                    _max = Math.max(_self.maxDate.day, _self.dayRange[1], this.dateRangeArr[currentMonth - 1]);  
                } else {
                    _max = Math.max(_self.dayRange[1], this.dateRangeArr[currentMonth - 1]);
                }
            } else { 
                _max = Math.max(_self.dayRange[1], this.dateRangeArr[currentMonth - 1]);
            }

            var isCurrent = false;
            for (var i = _min; i <= _max; i++) {
                if (!current) {
                    isCurrent = false;
                } else {
                    isCurrent = (i == current) ? true : false;  
                } 
                this.dayBox.appendChild(createOption(i + _self.daySuffix, i, isCurrent));
            }
        },

        _bindChangeYear: function() {

            addEvent(this.yearBox, 'change', function() {

                if (!this.yearBox.value.length) {
                    this._renderMonth(true, null);
                    this._renderDay(true, null);

                } else {
                    // 判断是否闰年
                    this.dateRangeArr[1] = isLeapYear(this.yearBox.value) ? 29 : 28;
                    
                    var _oldMonth = this.monthBox.value;
                    _oldMonth = _oldMonth.length ? parseInt(_oldMonth) + 1 : null;
                    this._renderMonth(false, _oldMonth);

                    if (!this.dayBox.disabled) {
                        repaintDaybox.call(this);
                    }
                }
            }.bind(this));
        },

        _bindChangeMonth: function() {

            addEvent(this.monthBox, 'change', function() {

                if (!this.monthBox.value.length) {
                    this._renderDay(true, null);
                } else {
                    repaintDaybox.call(this);
                }
            }.bind(this));
        },

        _initSet: function() {

            var _self = this.config;

            if  (_self.defaultDate) {
                this._renderYear(_self.defaultDate.year);
                this._renderMonth(false, _self.defaultDate.month);
                this._renderDay(false, _self.defaultDate.day);
            } else {
                this._renderYear(false);
                this._renderMonth(true, null);
                this._renderDay(true, null);
            }
        },

        _getDate: function() {
            return {
                year: this.yearSelect.value,
                month: this.monthSelect.value,
                day: this.dateSelect.value
            }; 
        }
    };

    function repaintDaybox() {
        var _oldDay = this.dayBox.value;
        _oldDay = _oldDay.length ? parseInt(_oldDay) : null;
        this._renderDay(false, _oldDay);
    }

    function addEvent(element, type, handler) {
        if (document.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (document.attachEvent){
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }  
    }

    function extend(src, dst) {
        var keys = Object.keys(dst);
        for (var i = 0; i < keys.length; i++) {
            src[keys[i]] = dst[keys[i]];
        }
        return src;        
    }

    function isLeapYear(year) {
        var isLeap;
        if (/^[1-9]\d*0{2,}$/.test(year)) {
            isLeap = (year % 400 == 0) ? true : false;
        } else {
            isLeap = (year % 4 == 0) ? true : false;
        }
        return isLeap;
    }

    function createOption(text, val, current) {
        var item = document.createElement('option');
        item.setAttribute('value', val);
        item.innerHTML = text;
        if (current) {
            item.selected = "selected";
        }
        return item;
    }

    function parseDate(date) {
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }

    function checkOptions(options) {

        if (options.maxDate) {
            options = setMaxMin('max', options);
        }

        if (options.minDate) { 
            options = setMaxMin('min', options);        
        }

        function setMaxMin(prefix, options) {
            options[prefix + 'Year'] = options[prefix + 'Date'].getFullYear();
            var monthEdge = options[prefix + 'Date'].getMonth() + 1;
            var replace = prefix == 'max' ? 1 : 0;
            if (options.monthRange && options.monthRange.length == 2) {
                options.monthRange.splice(replace, 1, monthEdge);
            } else {
                switch (prefix) {
                    case 'max':
                        options.monthRange = [1, monthEdge];
                        break;
                    case 'min':
                        options.monthRange = [monthEdge, 12];
                }
            }
            options[prefix + 'Day'] = options[prefix + 'Date'].getDate();
            return options;
        }

        if (!/^\d+$/.test(options.maxYear)) {
            delete options.maxYear;
        }

        if (!/^\d+$/.test(options.minYear)) {
            delete options.minYear;
        }

        if (options.maxYear !== undefined) {
            if (options.minYear !== undefined && options.maxYear < options.minYear) {
                delete options.maxYear;
                delete options.minYear;
            }
            if (options.minYear === undefined && options.maxYear < 1949) {
                delete options.maxYear;
            } 
        }

        if (options.minYear !== undefined) {
            if (options.maxYear === undefined && options.minYear > ((new Date).getFullYear + 50)){
                delete options.minYear;
            }
        }

        if (options.monthRange !== undefined) {
            switch (options.monthRange.length) {
                case 0:
                    delete options.monthRange;
                    break;
                case 1:
                    if (options.monthRange[0] <= 12) {
                        options.monthRange.push(12);
                    } else {
                        delete options.monthRange;
                    }
                    break;
                case 2:
                    if (options.monthRange[1] < options.monthRange[0]) {
                        options.monthRange.reverse();
                    }
                    break;
                default:
                    return;
            }
        }

        if (options.maxDay < 1 || options.maxDay > 31) {
            delete options.maxDay;
        }
        options.minDay < 1 && delete options.minDay;
        if (options.blank_text){
            options.blank_text.length !== 3 && delete options.blank_text;
        }
        return options;
    }

    function cascadingdate(container, options) {
        // options = checkOptions(options);

        var cascadingObj = new CascadingSet(container, options);
        cascadingObj._initSet();
        cascadingObj._bindChangeYear();
        cascadingObj._bindChangeMonth();

        return {
            getDate: cascadingObj._getDate.bind(cascadingObj)
        };
    }

    return cascadingdate;
}));