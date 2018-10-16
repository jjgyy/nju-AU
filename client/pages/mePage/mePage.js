var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        userInfo: {},
        logged: false
    },

    toMeQRcodePage: function () {
        wx.navigateTo({
            url: '../meQRcodePage/meQRcodePage',
        })
    },

    copy: function () {
        var that = this;
        wx.setClipboardData({
            data: that.data.userInfo.openId
        })
    },

    scanQR: function () {
        wx.scanCode({
            success: (res) => {
                console.log(res);
                console.log(res.result);
                var json = JSON.parse(res.result);
                switch (json.type) {
                    case 'association':
                        wx.navigateTo({
                            url: '../associationDetailPage/associationDetailPage?' + 'id=' + json.id
                        });
                        break;
                    case 'activity':
                        wx.navigateTo({
                            url: '../activityDetailPage/activityDetailPage?' + 'activity_id=' + json.id
                        });
                        break;
                }
            }
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

        console.log(getApp().data)

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
