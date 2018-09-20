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
            var that = this;
            console.log(e.detail.userInfo);
            getApp().data.userInfo = e.detail.userInfo;
            getApp().data.logged = true;

            //授权成功后，跳转进入小程序首页
            wx.switchTab({
                url: '../newsPage/newsPage'
            });

        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title:'告知',
                content:'您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
                showCancel:false,
                confirmText:'返回授权',
                success:function(res){
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”')
                    }
                }
            })
        }
    },


    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数

        var that = this;
        // 查看是否授权
        if (getApp().data.logged) {

            wx.getUserInfo({
                success: function (res) {
                    getApp().data.userInfo = res.userInfo;
                    //用户已经授权过
                    wx.switchTab({
                        url: '../newsPage/newsPage'
                    })
                }
            });

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
