var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        associationList: null
    },

    toAdminAssociationOptionsPage: function (e) {
        var association_id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../adminAssociationOptionsPage/adminAssociationOptionsPage?' + 'association_id=' + association_id
        });
    },

    onLoad: function (options) {
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAssociationList`,
            success(result) {
                that.setData({
                    associationList: result.data.data
                })
            },
            fail(error) {
                console.log('request fail', error);
            }
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
