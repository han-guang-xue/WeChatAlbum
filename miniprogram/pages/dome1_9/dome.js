// miniprogram/pages/dome1_9/dome.js
Page({
  data: {
    domeString:"字符串",
  },
  tapdome:function(e){
    wx.navigateTo({
      url: 'newtest?data=' + e.currentTarget.dataset.domestring
    })
  },
  returnData:function(data){
    console.log(data)
  }
})