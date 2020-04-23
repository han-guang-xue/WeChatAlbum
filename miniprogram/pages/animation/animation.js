Page({

  data: {
    animation:null,
  },

  onLoad: function (options) {

  },

  onReady: function () {
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '50% 50% 0'
    });
    animation.width(500).step().height(200).step();
    this.setData({
      animation: animation.export()
    });
  }
})