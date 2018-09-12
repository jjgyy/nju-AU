Page({
  data:{
    association_id: null
  },
  toManageInfoPage: function (){
    wx.navigateTo({
      url: '../manageInfoPage/manageInfoPage?' + 'id=' + this.data.association_id
    })
  },
  toManageWechatPage: function (){
    wx.navigateTo({
      url: '../manageWechatPage/manageWechatPage?' + 'id=' + this.data.association_id
    })
  },
  toManageQQPage: function (){
    wx.navigateTo({
      url: '../manageQQPage/manageQQPage?' + 'id=' + this.data.association_id
    })
  },
  toManageAnnouncePage: function (){
    wx.navigateTo({
      url: '../manageAnnouncePage/manageAnnouncePage?' + 'id=' + this.data.association_id
    })
  },
  toManageArticlePage: function (){
    wx.navigateTo({
      url: '../manageArticlePage/manageArticlePage?' + 'id=' + this.data.association_id
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