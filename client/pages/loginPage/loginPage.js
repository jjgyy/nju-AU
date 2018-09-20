var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮

            util.showBusy('正在登录...');

            const session = qcloud.Session.get();

            if (session) {
                // 第二次登录
                // 或者本地已经有登录态
                // 可使用本函数更新登录态
                qcloud.loginWithCode({
                    success: res => {
                        getApp().data.userInfo = res;
                        getApp().data.logged = true;
                        //授权成功后，跳转进入小程序首页
                        wx.switchTab({
                            url: '../newsPage/newsPage'
                        });
                    },
                    fail: err => {
                        console.log('session可能已经过期, 重新请求session');
                        console.error(err);

                        qcloud.login({
                            success: res => {
                                getApp().data.userInfo = res;
                                getApp().data.logged = true;
                                //授权成功后，跳转进入小程序首页
                                wx.switchTab({
                                    url: '../newsPage/newsPage'
                                });
                            },
                            fail: err => {
                                console.error(err);
                                util.showModel('登录错误', err.message)
                            }
                        });

                    }
                });
            } else {
                // 首次登录
                qcloud.login({
                    success: res => {
                        getApp().data.userInfo = res;
                        getApp().data.logged = true;
                        //授权成功后，跳转进入小程序首页
                        wx.switchTab({
                            url: '../newsPage/newsPage'
                        });
                    },
                    fail: err => {
                        console.error(err);
                        util.showModel('登录错误', err.message)
                    }
                })
            }
            /*
            var that = this;
            console.log(e.detail.userInfo);
            getApp().data.userInfo = e.detail.userInfo;
            getApp().data.logged = true;

            const session = qcloud.Session.get();

            if (session) {
                // 第二次登录
                // 或者本地已经有登录态
                // 可使用本函数更新登录态
                qcloud.loginWithCode({
                    success: res => {
                        that.setData({
                            userInfo: res,
                            logged: true
                        });
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
                        that.setData({
                            userInfo: res,
                            logged: true
                        });
                    },
                    fail: err => {
                        console.error(err);
                        util.showModel('登录错误', err.message)
                    }
                })
            }
            */

        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title:'告知',
                content:'您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
                showCancel:false,
                confirmText:'返回授权',
                success:function(res){

                }
            })
        }
    },


    onLoad: function (options) {
        // 查看是否授权
        if (getApp().data.logged) {

            //用户已经授权过
            wx.switchTab({
                url: '../newsPage/newsPage'
            })

        }

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
});
