(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.cascadingdate = factory();
    }
}(this, function() {

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
        for (let i = 0; i < keys.length; i++) {
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

    function CascadingSet(container, options) {
        this.container = container;

        if (options && typeof options === 'object') {
            this.config = extend({
                maxYear: (new Date).getFullYear() + 50,
                minYear: 1949,
                monthRange: [1, 12],
                maxDate: null,
                minDate: 1,
                yearSuffix: '',
                i18n: {
                    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                blank_text: ['请选择', '请选择', '请选择'],
                style_prefix: 'cascading'
            }, options);
        }

        this.yearSelect = null;
        this.monthSelect = null;
        this.dateSelect = null;
    }

    CascadingSet.prototype.renderYear = function() {
        var yearDom = document.createElement('select');
        yearDom.className = this.config.style_prefix + '_year';
        var htmlArr = [];

        htmlArr.push('<option value="">' + this.config.blank_text[0] + '</option>');
        for (var i = this.config.minYear; i <= this.config.maxYear; i++) {
            htmlArr.push('<option value="' + i + '">' + i + this.config.yearSuffix + '</option>');
        }
        yearDom.innerHTML = htmlArr.join('');
        return yearDom;
    };

    CascadingSet.prototype.renderMonth = function() {
        var htmlArr = [];
        htmlArr.push(this.monthSelect.innerHTML);

        for (var i = this.config.monthRange[0]; i <= this.config.monthRange[1]; i++) {
            htmlArr.push('<option value="' + (i - 1) + '">' + this.config.i18n.months[i - 1] +'</option>');
        }
        return htmlArr.join('');
    };

    CascadingSet.prototype.renderDate = function(month) {
        var dateArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (isLeapYear(this.yearSelect.value)) {
            dateArr.splice(1, 1, 29);
        }

        var htmlArr = [];
        htmlArr.push('<option value="">' + this.config.blank_text[2] + '</option>');
       
        var maxDate = this.config.maxDate && this.config.maxDate < dateArr[month] ? this.config.maxDate : dateArr[month];

        for (var i = this.config.minDate; i <= maxDate; i++) {
            htmlArr.push('<option value="' + i + '">' + i + '</option>');
        }

        return {
            html: htmlArr.join(''),
            dateArr: dateArr
        };
    };

    CascadingSet.prototype.renderSet = function() {
        
        var yearDom = this.renderYear();
        this.container.appendChild(yearDom);
        this.container.innerHTML = this.container.innerHTML + ' 年';

        createSelect.call(this, '_month', 1, ' 月');
        createSelect.call(this, '_date', 2, ' 日');

        function createSelect(classSuffix, blankIndex, label) {
            var dom = document.createElement('select');
            dom.className = this.config.style_prefix + classSuffix;
            dom.innerHTML = '<option value="">' + this.config.blank_text[blankIndex] + '</option>';
            dom.setAttribute('disabled', 'disabled');
            this.container.appendChild(dom);
            this.container.innerHTML = this.container.innerHTML + label;
        }

        this.eventHandler();
    };

    CascadingSet.prototype.eventHandler = function() {
        var selects = this.container.getElementsByTagName('select');
        this.yearSelect = selects[0];
        this.monthSelect = selects[1];
        this.dateSelect = selects[2];
        
        addEvent(this.yearSelect, 'change', function() {
            if (this.yearSelect.value) {

                if (this.monthSelect.getAttribute('disabled')) {
                    this.monthSelect.removeAttribute('disabled');
                    this.monthSelect.innerHTML = this.renderMonth();
                    return;
                }

                if (!this.dateSelect.getAttribute('disabled')) {
                    var oldValue = this.dateSelect.value;
                    var dateResult = this.renderDate(this.monthSelect.value);
                    this.dateSelect.innerHTML = dateResult.html;
                    if (oldValue !== '' && this.monthSelect.value == '1' && oldValue <= dateResult.dateArr[1]) {
                        this.dateSelect.value = oldValue;  
                    }
                }
            } else {
                disableSelect(this.monthSelect);
                disableSelect(this.dateSelect);
            }
        }.bind(this));

        addEvent(this.monthSelect, 'change', function() {
            if (this.monthSelect.value) {
                this.dateSelect.getAttribute('disabled') && this.dateSelect.removeAttribute('disabled');
                var oldValue = this.dateSelect.value;
                var dateResult = this.renderDate(this.monthSelect.value);
                this.dateSelect.innerHTML = dateResult.html;

                if (oldValue && oldValue <= dateResult.dateArr[this.monthSelect.value]) {
                    return this.dateSelect.value = oldValue;
                }   
            } else {
                disableSelect(this.dateSelect);
            }
        }.bind(this));

        function disableSelect(dom) {
            dom.setAttribute('disabled', 'disabled');
            dom.value = '';
        }
    };

    CascadingSet.prototype.getDate = function() {
        return {
            year: this.yearSelect.value,
            month: this.monthSelect.value,
            date: this.dateSelect.value
        };
    };

    function checkOptions(options) {
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

        if (options.maxDate !== undefined) {
            if (options.minDate !== undefined && options.minDate > options.maxDate) {
                delete options.maxDate;
                delete options.minDate;
            }
            if (options.maxDate < 1 || options.maxDate > 31) {
                delete options.maxDate;
            }
        }

        options.minDate < 1 && delete options.minDate;
        if (options.blank_text){
            options.blank_text.length !== 3 && delete options.blank_text;
        }
        return options;
    }

    function cascadingdate(container, options) {
        options = checkOptions(options);

        var cascadingObj = new CascadingSet(container, options);
        cascadingObj.renderSet();
        return cascadingObj.getDate.bind(cascadingObj);
    }

    return cascadingdate;
}));