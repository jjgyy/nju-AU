var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    associationList:[],
    currentTab:0,
  },

  toNewsWritePage: function () {
    wx.navigateTo({
      url: '../newsWritePage/newsWritePage',
    })
  },

  toAssociationCreatePage: function () {
    wx.navigateTo({
      url: '../associationCreatePage/associationCreatePage',
    })
  },


  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: `${config.service.host}/weapp/getAssociationList`,
      success(result) {
        console.log(result.data);
        that.setData({
          associationList: result.data.data
        })
      },
      fail(error) {
        console.log('request fail', error);
      }
    });

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