var config = require('../../config')

Page({
  data: {
  },

  id: function(e){
    this.data.id = e.detail.value;
  },

  qq: function(e){
    this.data.qq = e.detail.value;
  },

  official: function(e){
    this.data.official = e.detail.value;
  },

  submit: function () {
    var that = this;
    wx.request({
      url: `${config.service.host}/weapp/addAssociationQQ`,
      data: {
        id: that.data.id,
        qq: that.data.qq
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(result) {
        console.log(result.data);
      },
      fail(error) {
        console.log('request fail', error);
      }
    })
  },

  submit2: function () {
    var that = this;
    wx.request({
      url: `${config.service.host}/weapp/addAssociationOfficial`,
      data: {
        id: that.data.id,
        official: that.data.official
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(result) {
        console.log(result.data);
      },
      fail(error) {
        console.log('request fail', error);
      }
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})