// miniprogram/pages/image/image.js
Page({

  data: {
    curData:null,
  },

  onLoad: function (options) {
    
  },
  text:function(e){
    let that = this;
    let ctx = wx.createCanvasContext('actReview');
    console.log(ctx)
    wx.chooseImage({
      success: function(res) {
        console.log(res.tempFilePaths)
        let data  = [];
        res.tempFilePaths.forEach(item=>{
          wx.getImageInfo({
            src: item,
            success(res) {
              ctx.setFillStyle('#fff')
              ctx.fillRect(0, 0, 300, 300)
              let visibleV = null//截取的图片的宽高
              let visibleX = null // 所截取的图片的x轴坐标
              let visibleY = null // 所截取的图片的y轴坐标
              if (res.width > res.height) {
                visibleV = res.height
                visibleX = (res.width - res.height) / 2
                visibleY = 0
              } else {
                visibleV = res.width
                visibleX = 0
                visibleY = (res.height - res.width) / 2
              }        
              ctx.drawImage(item, visibleX, visibleY, visibleV, visibleV, 25, 25, 200, 200);             
              ctx.draw()
              ctx.
              console.log(stx)
            }
          })
        })
        
      },
    })
  },
  dome1:function(e){
    let that = this;
    wx.previewImage({
      urls: that.data.curData,
    })
  } 
})