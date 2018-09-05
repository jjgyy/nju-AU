
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    title: null,
    author: null,
    author_from: null,
    article: null
  },

  title: function(e){
    this.data.title = e.detail.value;
  },

  author: function(e){
    this.data.author = e.detail.value;
  },

  author_from: function(e){
    this.data.author_from = e.detail.value;
  },

  article: function(e){
    this.data.article = e.detail.value;
  },


  publish: function () {
    var that = this;
    wx.request({
      url: `${config.service.host}/weapp/addNews`,
      data: {
        title: that.data.title,
        author: that.data.author,
        author_from: that.data.author_from,
        article: that.data.article
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