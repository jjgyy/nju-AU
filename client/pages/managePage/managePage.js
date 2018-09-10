var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    manageAssociationList: []
  },
  toManageOptionsPage: function (e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../manageOptionsPage/manageOptionsPage?' + 'id=' + id
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    util.showBusy('加载中...');
    var that = this;

    qcloud.request({
      url: `${config.service.host}/weapp/getUserManageList`,
      login: true,
      success (result) {
        that.setData({
          manageAssociationList: result.data.data
        });
        util.showSuccess('加载成功');
      },
      fail (error) {
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