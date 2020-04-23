let animation =  wx.createAnimation({
  duration: 300,
  delay: 10,
  timingFunction: 'ease-in-out'
})
Page({
  data: {
    isTrue:true
  },
  onLoad: function (options) {
      
  },
  _touchstart:function(e){
    this.setData({
      isTrue:false
    })
    let item = e.changedTouches[0];
    this.startX =  item.clientX;
    this.startY =  item.clientY;
    console.log(this.startX)
    console.log(this.startY)
  },
  _touchmove:function(e){
    console.log(e)
    let item = e.changedTouches[0];
    let moveX = item.clientX;
    let moveY = item.clientY;
    let diffX = moveX - this.startX;
    let diffY = moveY - this.startY;
    console.log(diffX)
    console.log(diffY)
    animation.rotateX(-diffY).rotateY(diffX).step();
    this.setData({
      animation:animation.export()
    })
  },
  _touchend:function(e){
    this.setData({
      isTrue:true
    })
  }
  
})