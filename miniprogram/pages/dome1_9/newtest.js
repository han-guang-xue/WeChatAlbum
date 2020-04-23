Page({
  data:{
    data:null
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      data:options.data
    })
  },
  dome:function(){
    var pages = getCurrentPages(); //获取当前页面层级
    var prePage = pages[pages.length - 2];  //获取上一个页面的层级
    prePage.returnData({
      name:'真难啊',
      age:18
    })
    wx.navigateBack(); //返回上一个层级的页面
  }
})