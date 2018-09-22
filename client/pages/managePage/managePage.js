var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    manageAssociationList: []
  },
  toManageOptionsPage: function (e){
    var id = e.currentTarget.dataset.id,
        name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../manageOptionsPage/manageOptionsPage?' + 'id=' + id + '&name=' + name
    })
  },

  openConfirm: function () {
    wx.showModal({
      title: '申请入驻',
      content: '如果已成立的社团没有出现在社团列表，请进入填写入驻信息表',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../associationCreatePage/associationCreatePage'
          })
        }else{
        }
      }
    });
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
