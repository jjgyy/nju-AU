var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        association_id: null,

        activityList: null
    },

    toManageWriteActivityPage: function () {
        wx.navigateTo({
            url: '../manageWriteActivityPage/manageWriteActivityPage?' + 'id=' + this.data.association_id
        })
    },

    onLoad: function (options) {
        this.setData({
            association_id: options.id
        });
    },
    onReady: function () {

    },
    onShow: function () {
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAssociationActivityList`,
            data: {
                association_id: that.data.association_id
            },
            success (res) {
                that.setData({
                    activityList: res.data
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });
    },
    onHide: function () {

    },
    onUnload: function () {

    }
});
