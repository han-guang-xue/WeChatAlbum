Component({
    properties: {
        typeTool: String
    },

    data: {
        data: null,
        chatView: null,
        startTime: true,
        endTime: null,
        _bottom: null,
        date: null, //日历插件
        select_day: 1, //天数插件
        curScaleValue: 0,
        scroll_head: 0,
        scroll_end: 0,
        unit: null,
        total_scale: null,
        toScaleView: null, //设置默认值
        interval_scale_value: null, //
        inputValue: null,
        multi: [],

        dateData: {
            maxdate: null,
            mindate: null
        },

        curPageDate: {
            year: [],
            month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            date: [],
            height: 30,
            value: []
        },
        curPageDate_value: [0, 0, 0],

        isLoadingHistory: false,

        isDropDownFlag: true,
        isSlideTop: true,

        distanceTop: false,

        istouch: false,

        isshowMenu: {
            show: false,
            success: null
        },
        fristdata: {
            show: false,
            success: null
        },

        show: true,
        isshow: false
    },

    methods: {
        _onLoad: function(data) {
            this.data.isDropDownFlag = false;
            this.data.isSlideTop = false;
            let that = this;
            setTimeout(function(e) {
                that.data.isDropDownFlag = true;
                that.data.isSlideTop = true;
            }, 1000)
            console.log("<----- 初始化数据--start ----->")
            console.log(data)
            this.setData({ data: data });
            if (data.type === 'chat') {
                let i = 0;
                data.chatData.forEach(item => {
                    if (data.isPosition === "bottom" || data.isPosition === "top") {
                        item.key = i;
                    }
                    i++;
                    if (i === 1) {
                        if (item.type === "card_list" || item.type === "card_middle" || item.type === "mode_QA" || item.type === "mode_PV") {
                            this.setData({ isLoadingHistory: true })
                        } else {
                            this.setData({ isLoadingHistory: false })
                        }
                    }
                });
                this.setData({ data: data });
                let that = this;
                if (data.isPosition === "bottom") {
                    if (data.chatData.length < 4) {
                        that.setData({ chatView: "chat_" + (data.chatData[0].key) })
                    } else {
                        that.setData({ chatView: 'chat_' + (data.chatData[data.chatData.length - 1].key) })
                    }
                } else if (data.isPosition === "top") {
                    that.setData({ chatView: 'chat_' + (data.chatData[0].key) })
                } else if (data.isPosition === undefined || data.isPosition === "none" || data.isPosition === "no") {
                    //不做定位
                } else {
                    that.setData({ chatView: 'chat_' + data.isPosition })     
                }
            }
            if (data.type === 'select_day') {
                this.setData({ select_day: parseInt(data.btnNCB[0].content) })
            }
            try {
                let multi = data.btnNCB.filter(item => item.key === 1)[0].content;
                multi.forEach(item => { item.select = false; })
                this.setData({ multi: multi })
            } catch (e) {}
            try {
                if (data.style === "calibration_thermometer") {
                    this.setData({ total_scale: (data.maxscale * 10 - data.minscale * 10) })
                } else if (data.style === "calibration_height" || data.style === "calibration_weight") {
                    this.setData({ total_scale: data.maxscale - data.minscale })
                }
            } catch (e) {}
            try {
                if (data.style === "calibration_thermometer") {
                    let value = (data.value * 10 - data.minscale * 10) - 17
                    this.setData({
                        toScaleView: 'scale_' + value,
                        interval_scale_value: data.minscale,
                    })
                } else if (data.style === "calibration_height" || data.style === "calibration_weight") {
                    let value = (data.value - data.minscale) - 17
                    this.setData({
                        toScaleView: 'scale_' + value,
                        interval_scale_value: data.minscale,
                    })
                }
            } catch (e) { console.log(e) }
            try {
                this.setData({ _bottom: parseInt(data.layout.split("bottom-")[1]) })
            } catch (e) {}
            try {
                this.setData({ unit: data.layout.split("unit-")[1] })
            } catch (e) {}
            try {
                let screenWidth = wx.getSystemInfoSync().windowWidth / 2;
                this.setData({
                    scroll_head: screenWidth,
                    scroll_end: screenWidth
                })
            } catch (e) { console.log(e) }

            if (data.type === 'date_curpage') {
                let that = this;
                this.data.dateData.maxdate = data.maxdate;
                this.data.dateData.mindate = data.mindate;
                let date = new Date();
                for (var i = date.getFullYear() - 100, j = 0; i < date.getFullYear() + 100; i++, j++) {
                    that.data.curPageDate.year.push(i);
                    if (i === date.getFullYear()) {
                        that.data.curPageDate_value[0] = j;
                    }
                }
                that.data.curPageDate_value[1] = date.getMonth();
                that.getDayByYearAndMonth(date.getFullYear(), date.getMonth(), date.getDate());
                that.data.curPageDate.value = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
            }
            console.log("<----- 初始化数据--end   ----->")
        },
        _showMenu: function(success) {
            this.data.isshowMenu.show = true;
            this.data.isshowMenu.success = success;
        },
        _showFirstMenu: function(success) {
            let that = this;
            setTimeout(function() {
                that.data.fristdata.show = true;
            }, 1000)
            this.data.fristdata.success = success;
        },
        _touchmove: function(e) {
            this.data.startTime = false;
        },
        _touchstart: function(e) {
            this.data.startTime = e.timeStamp;
        },
        _touchend: function(e) {
            let that = this;
            if (!this.data.startTime) {
                this.data.startTime = true;
                return;
            }
            this.data.endTime = e.timeStamp;
            if (e.timeStamp - this.data.startTime < 200) {
                this._previewImage(e)
            }
            if (e.timeStamp - this.data.startTime > 300) {
                wx.showActionSheet({
                    itemList: ['删除图片'],
                    itemColor: '#000000',
                    success: (result) => {
                        e = e.currentTarget.dataset;
                        that.data.data.success(e);
                    }
                });
            }
        },
        _clickBtn: function(e) {
            this.data.data.success(e.currentTarget.dataset)
        },
        _mode_QA: function(e) {
            let view = e.currentTarget.dataset.toview;
            this.data.data.success({
                type: 'toview',
                value: view
            })
        },
        _clickBtnDialog: function(e) {
            this.data.data.success({
                type: "info",
                content: "症状反馈",
                data: e.detail[0].value,
                isAdd: "YES"
            })
        },
        _clickBtnReport: function(e) {
            this.data.data.success({
                type: "report",
                content: "报告上传",
                isAdd: "YES"
            })
        },
        _clickBtnDate: function(e) {
            e = e.currentTarget.dataset;
            let date = new Date();
            if (e.select === 'yesterday') {
                date.setDate(date.getDate() - 1);
            }
            let year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();
            let value = year + "-" + (month > 9 ? month : "0" + month) + "-" + (day > 9 ? day : "0" + day)
            this.data.data.success({ key: e.key, value: value });
        },
        _clickBtnDateDialog: function(e) {
            console.log("设置true")
            this.setData({
                show: true,
                isshow: true
            })
            let that = this;
            setTimeout(function() {
                that.data.isshow = false;
            }, 800)
            this.data.data.success({
                key: 0,
                value: e.detail.toString()
            });
        },
        _setShow: function(e) {
            console.log("设置false")

            if (this.data.isshow) return;
            this.setData({
                show: false
            })
        },
        _setshowTrue: function() {
            this.setData({
                show: true,
                isshow: true
            })
            let that = this;
            setTimeout(function() {
                that.data.isshow = false;
            }, 800)
        },
        _clickBtnInputCheck: function(e) {
            let check = e.currentTarget.dataset.check,
                value = e.currentTarget.dataset.value;
            let ischeck = util.ycxFormValidation.filter(item => item.key === check)[0].check(value)
            if (ischeck === true) {
                this.setData({
                    inputValue: ""
                });
                this._clickBtn(e);
            } else {
                wx.showToast({
                    title: ischeck,
                    icon: 'none',
                });
            }
        },
        _previewImage: function(e) {
            let that = this;
            wx.previewImage({
                current: e.currentTarget.dataset.curpath,
                urls: that.data.data.chatData.filter(item => { return item.type === 'image' }).map(item => { return item.content })
            });

        },


        /** 天数组件 */
        _select_day: function(e) {
            let isAdd = e.currentTarget.dataset.isadd;
            if (isAdd) {
                this.setData({ select_day: ++this.data.select_day })
            } else {
                this.setData({ select_day: --this.data.select_day })
            }
        },
        _initScale: function(e) {
            let screenWidth = wx.getSystemInfoSync().windowWidth,
                scrollWidth = e.detail.scrollWidth,
                scrollLeft = e.detail.scrollLeft,
                unit = (scrollWidth - screenWidth) / this.data.total_scale,
                view = scrollLeft,
                value = view / unit;
            value = parseInt(value);
            if (this.data.data.style === 'calibration_thermometer') {
                this.setData({ curScaleValue: ((parseFloat(value) / 10) + this.data.interval_scale_value) + this.data.unit })
            } else {
                this.setData({ curScaleValue: (value + this.data.interval_scale_value) + this.data.unit })
            }
        },

        _setInputValue: function(e) {
            this.setData({ inputValue: e.detail.value });
        },
        _initMulti: function(e) {
            e = e.currentTarget.dataset;
            let index = e.index,
                multi = this.data.multi;
            let status = e.status;
            multi[index].select = !status;
            this.setData({ multi: multi })
        },
        _returnMulti: function(e) {
            let selectList = this.data.multi.filter(item => item.select === true);
            if (selectList.length === 0) {
                wx.showToast({
                    title: '至少选择一项',
                    icon: 'none'
                });
                return;
            }
            e.currentTarget.dataset.value = selectList.map(item => item.value).join(",");
            this._clickBtn(e);
        },
        _initRadio: function(e) {
            e = e.currentTarget.dataset;
            let index = e.index,
                multi = this.data.multi;
            multi.forEach(item => item.select = false);
            multi[index].select = true;
            this.setData({ multi: multi })
        },
        _clickBtnCurPageDate: function(e) {
            let value = this.data.curPageDate.value;
            e.currentTarget.dataset.key = 0;
            e.currentTarget.dataset.value = value[0] + "月" +
                (value[1] < 10 ? "0" + value[1] : value[1]) + "年" +
                (value[2] < 10 ? "0" + value[2] : value[2]) + "日"
            let ymaxdate = this._checkTimeFormat(this.data.dateData.maxdate),
                ymindate = this._checkTimeFormat(this.data.dateData.mindate);

            let curdate = new Date(value[0], value[1], value[2]);
            if (ymaxdate !== null) {
                if (curdate.getTime() - ymaxdate.getTime() > 0) {
                    wx.showToast({ title: '选择的时间大于当前时间', icon: 'none' });
                    return;
                }
            }
            if (ymindate !== null) {
                if (curdate.getTime() - ymindate.getTime() < 0) {
                    wx.showToast({ title: '选择的时间太之前,系统不支持', icon: 'none' });
                    return;
                }
            }

            this._clickBtn(e);
        },

        _checkTimeFormat: function(ydate) {
            let maxdate = null;
            if (ydate !== "" && ydate !== undefined && ydate !== null) {
                maxdate = ydate === "curdate" ? new Date() : null;
                if (ydate.length === 10) {
                    let year = parseInt(ydate.substring(0, 4)),
                        month = parseInt(ydate.substring(5, 7)),
                        dates = parseInt(ydate.substring(8, 10));
                    maxdate = new Date(year, month, dates);
                }
            } else {
                maxdate = null;
            }
            return maxdate;
        },

        /** 判断是否松手 */
        _touchendstart: function(e) {
            this.data.istouch = true;
        },
        _touchendsrc: function(e) {
            console.log("------触摸结束------")
            this.data.istouch = false;
            let that = this;
            if (that.data.distanceTop && that.data.isLoadingHistory) {
                that._scorllTop();
                setTimeout(function() {
                    that.setData({ distanceTop: false });
                }, 800)
            }
            if (that.data.isshowMenu.show) {
                that.data.isshowMenu.success();
                setTimeout(function() {
                    that.data.isshowMenu.show = false;
                }, 1000);
            }
            if (that.data.fristdata.show) {
                that.data.fristdata.success();
                setTimeout(function() {
                    that.data.fristdata.show = false;
                }, 1000);
            }
        },
        /** 滚动展示历史消息 */
        _chatScroll: function(e) {
            console.log("-----滚动监听------")
            this.data.fristdata.show = false;
            this.data.isshowMenu.show = false;
            if (e.detail.scrollTop < 10) {
                this.setData({ distanceTop: true });
            } else {
                this.setData({ distanceTop: false });
            }
        },
        _scorllTop: function() {
            let that = this;
            if (!this.data.isDropDownFlag) return;
            this._showHistroy({
                value: "下拉",
                type: "dropDown",
                success: function() {
                    that.data.isSlideTop = false;
                    setTimeout(function() { that.data.isSlideTop = true; }, 2000);
                }
            })
        },
        _scorllBottom: function(e) {
            let that = this;
            if (!this.data.isSlideTop) return;
            this._showHistroy({
                value: '上滑',
                type: "slideTop",
                success: function() {
                    that.data.isDropDownFlag = false;
                    setTimeout(function() { that.data.isDropDownFlag = true; }, 2000);
                }
            })
        },
        _showHistroy: function(data) {
            this.data.data.success({
                type: "slide",
                data: data
            })
        },

        /**日历插件 */
        getDayByYearAndMonth: function(year, month, day) {
            console.log(year + "----" + month);
            let date = new Date(year, month + 1, 0);
            this.data.curPageDate.date = [];
            for (let i = 0; i < date.getDate(); i++) {
                this.data.curPageDate.date.push(i + 1);
                if (i === day) {
                    this.data.curPageDate_value[2] = i - 1;
                }
            }
            this.setData({ curPageDate: this.data.curPageDate });
            this.setData({ curPageDate_value: this.data.curPageDate_value })
            console.log(this.data.curPageDate)
        },
        bindChange: function(e) {
            console.log(e);
            let indexs = e.detail.value,
                year = this.data.curPageDate.year[indexs[0]],
                month = this.data.curPageDate.month[indexs[1]],
                date = this.data.curPageDate.date[indexs[2]];
            this.data.curPageDate.value = [year, month, date];
            this.data.curPageDate_value = indexs;
            this.getDayByYearAndMonth(year, month - 1, date);
        },
        _bindkeyboardheightchange: function(e) {
            this.data.data.success({
                key: "bindkeyboardheightchange",
                value: e
            })
        },
        _showinfocardimages: function(e) {
            wx.previewImage({
                current: e.currentTarget.dataset.imagecontent,
                urls: e.currentTarget.dataset.imagescontent
            });
        },
        _opertext: function(e) {
            e = e.currentTarget.dataset;
            this.data.data.success({
                type: "oper",
                view: e.view,
                question: e.question,
                answer: e.answer
            })
        },
        /** 设置your feeling */
        _setfeel: function(e) {
            e = e.currentTarget.dataset;
            this.data.data.success({
                type: 'feeling',
                key: e.feeling,
                value: e.content
            })
        }

    },
    observers: {
        'select_day': function(select_day) {
            if (select_day < 1) {
                wx.showToast({
                    title: '天数最小为1',
                    icon: 'none'
                });
                this.setData({ select_day: 1 });
            }
        },
        'distanceTop': function(distanceTop) {
            if (distanceTop && this.data.isLoadingHistory && !this.data.istouch) {
                this._scorllTop();
            }
        }
    }

})
