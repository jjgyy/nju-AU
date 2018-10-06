var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        association_id: null
    },

    toAdminAssociationManagerPage: function () {
        var that = this;
        wx.navigateTo({
            url: '../adminAssociationManagerPage/adminAssociationManagerPage?'  + 'association_id=' + that.data.association_id
        });
    },

    onLoad: function (options) {
        this.setData({
            association_id: options.association_id
        });
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
