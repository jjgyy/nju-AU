
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{

  },

  id: function(e){
    this.data.id = e.detail.value;
  },

  name: function(e){
    this.data.name = e.detail.value;
  },

  name_english: function(e){
    this.data.name_english = e.detail.value;
  },

  category: function(e){
    this.data.category = e.detail.value;
  },

  image_src: function(e){
    this.data.image_src = e.detail.value;
  },

  intro: function(e){
    this.data.intro = e.detail.value;
  },

  submit: function () {
    var that = this;
    wx.request({
      url: `${config.service.host}/weapp/addAssociation`,
      data: {
        id: that.data.id,
        name: that.data.name,
        name_english: that.data.name_english,
        category: that.data.category,
        image_src: that.data.image_src,
        intro: that.data.intro
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

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
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