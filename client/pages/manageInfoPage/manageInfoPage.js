var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    association_id: null,
    intro: null
  },
  intro: function(e){
    this.data.intro = e.detail.value;
  },

  submit: function(){
    this.openConfirm()
  },
  openConfirm: function () {
    var that = this;
    wx.showModal({
      title: '确认修改',
      content: '修改社团基本信息',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          util.showBusy('正在提交...');
          qcloud.request({
            url: `${config.service.host}/weapp/updateAssociationInfo`,
            data: {
              id: that.data.association_id,
              intro: that.data.intro
            },
            login: true,
            success () {
              util.showSuccess('修改成功');
            },
            fail (error) {
              console.log('request fail', error);
              util.showModel('出错了', error.message);
            }
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
    this.setData({
      association_id: options.id
    });
    wx.request({
      url: `${config.service.host}/weapp/getAssociationDetail`,
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        that.setData({
          intro: res.data.data.intro
        });
        util.showSuccess('加载成功');
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