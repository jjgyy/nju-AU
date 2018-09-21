var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false
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

    toAssociationAddContactPage: function () {
        wx.navigateTo({
            url: '../associationAddContactPage/associationAddContactPage',
        })
    },

    toAdminLoginPage: function () {
        wx.navigateTo({
            url: '../adminLoginPage/adminLoginPage',
        })
    },

    toAdminPage: function () {
        wx.navigateTo({
            url: '../adminPage/adminPage',
        })
    },

    copy: function () {
        var that = this;
        wx.setClipboardData({
            data: that.data.userInfo.openId
        })
    },

    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
        if (getApp().data.logged) {
            this.setData({
                userInfo: getApp().data.userInfo,
                logged: getApp().data.logged
            });
        }
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
});
