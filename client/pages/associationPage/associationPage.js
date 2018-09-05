var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    associationList: [],
    currentTab: 0,
    clientHeight: null,
    leftTabColor: '#a941a1',
    rightTabColor: '#cccccc',
    leftTabLineColor: '#a941a1',
    rightTabLineColor: 'rgba(0,0,0,0)'
  },

  clickLeftTab: function () {
    this.setData({
      currentTab: 0
    })
  },

  clickRightTab: function () {
    this.setData({
      currentTab: 1
    })
  },

  switchPage: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.refreshTab();
  },


  refreshTab: function () {
    if (this.data.currentTab == 0){
      this.setData({
        leftTabColor: '#a941a1',
        rightTabColor: '#cccccc',
        leftTabLineColor: '#a941a1',
        rightTabLineColor: 'rgba(0,0,0,0)'
      });
    }
    else{
      this.setData({
        leftTabColor: '#cccccc',
        rightTabColor: '#a941a1',
        leftTabLineColor: 'rgba(0,0,0,0)',
        rightTabLineColor: '#a941a1'
      });
    }
  },


  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight * 0.938
        });
      }
    });

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