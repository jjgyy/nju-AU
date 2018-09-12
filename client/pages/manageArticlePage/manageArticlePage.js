Page({
  data:{
    association_id: null
  },

  toManageWriteArticlePage: function () {
    wx.navigateTo({
      url: '../manageWriteArticlePage/manageWriteArticlePage?' + 'id=' + this.data.association_id
    })
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      association_id: options.id
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})