var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        activity_id: null,

        activityDetail: null,
        ticketDetail: null
    },
    onLoad: function (options) {
        this.setData({
            activity_id: options.activity_id
        });

        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getActivityDetail`,
            data: {
                activity_id: that.data.activity_id
            },
            success (result) {

                that.setData({
                    activityDetail: result.data.activityDetail,
                    ticketDetail: result.data.ticketDetail
                });

                console.log(that.data);

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
