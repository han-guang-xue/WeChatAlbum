Function.prototype.before = function (beforefn) {
  var _self = this;    //保存原函数引用
  return function () { //返回包含了原函数和新函数的"代理函数"
    beforefn.apply(this, arguments); //执行新函数，修正this
    return _self.apply(this, arguments); //执行原函数
  }
};
Page({
  data: {
    flag:true
  },

  onLoad: function (options) {
    //做定位,定位到最后一个元素
    let that = this;
    setTimeout(function(){
      that.setToviewIntercept();
    },800)
  },
  setToview:function(e){
    this.setData({
      toview: "view_9"
    })
  },
  setToviewIntercept:function(e){
   this.setToview.before(()=>{
     this.data.flag = false;
     let that = this;
     setTimeout(function () {
       that.data.flag = true
     }, 500)
   })();
  },
  rightSide: function (e) {
    console.log("我滚动到最右边了");
  },
  rightSideIntercept:function(){
    try{
      console.log("good")
      this.rightSide.before(() => {
        if (!this.data.flag) {
          throw "禁止右滑动事件触发"
        }  
      })()
    }catch(e){
      console.log(e)
    }
  }
})
