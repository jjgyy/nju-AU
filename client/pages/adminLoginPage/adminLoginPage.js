var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    password: null
  },

  password: function(e){
    this.data.password = e.detail.value;
  },

  validate: function () {
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/validateAdmin`,
      data: {
        password: that.data.password
      },
      login: true,
      success (result) {
        if(result.data.data == 'pass') {
          wx.redirectTo({
            url: '../adminPage/adminPage',
          });
        } else {
          util.showModel('认证失败', '确认您的密码以及微信后台身份');
        }
      },
      fail (error) {
        console.log('request fail', error);
        util.showModel('出错了', error.message);
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