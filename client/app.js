//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')

App({
  data:{
    userInfo: {},
    logged: false,
    needRefreshJoined: true
  },
  onLaunch: function () {
    util.showBusy('登录中...');
    var that = this;

    qcloud.setLoginUrl(config.service.loginUrl)

    const session = qcloud.Session.get()

    if (session) {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          that.data.userInfo = res;
          that.data.logged = true;
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err);
          util.showModel('登录错误', err.message)
        }
      })
    } else {
      // 首次登录
      qcloud.login({
        success: res => {
          that.data.userInfo = res;
          that.data.logged = true;
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err);
          util.showModel('登录错误', err.message)
        }
      })
    }

    util.showBusy('加载社团...');
    qcloud.request({
      url: `${config.service.host}/weapp/getUserAssociationList`,
      login: true,
      success (result) {
        that.data.joinedAssociationList = result.data.data;
      },
      fail (error) {
        console.log('request fail', error.message);
      }
    });
    util.showSuccess('加载成功');

  }

})