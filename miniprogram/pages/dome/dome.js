// miniprogram/pages/dome/dome.js
Page({
  data: {
    curData:"这是我的第一个小程序",
    curDataArray: ["nice","good","greate"],
    curDataObject:{
      name:"张三",
      age:18
    },
    curDataArrayObject:[{
      ccolor:"红色",
      ecolor:"red"
    },{
      name:"李四",
      age:21
    }, {
      ccolor: "绿色",
      ecolor: "green"
    },{
      name:"王五",
      age:21
    }]
  },
  onLoad: function (options) {
   
  },
  onTap:function(){
   
  },
  onReady: function () {
    console.log(this.data.arr)
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})