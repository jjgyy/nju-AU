var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        ticketList: null
    },

    toActivityDetailPage: function (e) {
        wx.navigateTo({
            url: '../activityDetailPage/activityDetailPage?' + 'activity_id=' + e.currentTarget.dataset.id
        })
    },

    onLoad: function (options) {
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getUserActivityTicketList`,
            data: {
                open_id: getApp().data.userInfo.openId
            },
            success (result) {

                that.setData({
                    ticketList: result.data
                });

            },
            fail (error) {
                console.log('request fail', error);
            }
        });

    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    }
});
