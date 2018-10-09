var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        activity_id: null,

        activityDetail: null,
        ticketDetail: null,

        ownTicket: false
    },

    toAssociationDetailPage: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../associationDetailPage/associationDetailPage?' + 'id=' + that.data.activityDetail.association_id
        })
    },

    openLocation: function () {
        var that = this;
        wx.openLocation({
            latitude: that.data.activityDetail.wx_location.latitude,
            longitude: that.data.activityDetail.wx_location.longitude,
            scale: 14
        });
    },

    openConfirm: function () {
        var that = this;
        wx.showModal({
            title: '确认抢票',
            content: '将此入场券加入我的入场券',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        ownTicket: true
                    });

                    wx.request({
                            url: `${config.service.host}/weapp/grabActivityTicket`,
                            data: {
                                activity_id: that.data.activity_id,
                                open_id: getApp().data.userInfo.openId
                            },
                            success(result) {
                                console.log(result);
                                if (result.data.msg === 'owned') {
                                    util.showSuccess('您已拥有!');
                                }
                                if (result.data.msg === 'success') {
                                    util.showSuccess('抢票成功!');
                                }

                                wx.request({
                                    url: `${config.service.host}/weapp/getActivityTicketDetail`,
                                    data: {
                                        activity_id: that.data.activity_id
                                    },
                                    success (result) {

                                        that.setData({
                                            ticketDetail: result.data
                                        });

                                    },
                                    fail (error) {
                                        console.log('request fail', error);
                                    }
                                });

                                wx.request({
                                    url: `${config.service.host}/weapp/getActivityTicketOwned`,
                                    data: {
                                        activity_id: that.data.activity_id,
                                        open_id: getApp().data.userInfo.openId
                                    },
                                    success (result) {

                                        if (result.data === true) {
                                            that.setData({
                                                ownTicket: true
                                            });
                                        }

                                    },
                                    fail (error) {
                                        console.log('request fail', error);
                                    }
                                });

                            },
                            fail(error) {
                                console.log('request fail', error);
                            }
                        });

                }else{
                }
            }
        });
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
                result.data.date = result.data.date.substr(0,10);

                result.data.wx_location = result.data.wx_location ? JSON.parse(result.data.wx_location) : '';

                that.setData({
                    activityDetail: result.data
                });

            },
            fail (error) {
                console.log('request fail', error);
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getActivityTicketDetail`,
            data: {
                activity_id: that.data.activity_id
            },
            success (result) {

                that.setData({
                    ticketDetail: result.data
                });

            },
            fail (error) {
                console.log('request fail', error);
            }
        });


        wx.request({
            url: `${config.service.host}/weapp/getActivityTicketOwned`,
            data: {
                activity_id: that.data.activity_id,
                open_id: getApp().data.userInfo.openId
            },
            success (result) {

                if (result.data === true) {
                    that.setData({
                        ownTicket: true
                    });
                }

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
