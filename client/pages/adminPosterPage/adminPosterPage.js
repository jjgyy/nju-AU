var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        posterList: null,

        activityList: null,
        offset: 0,
        canLoadMore: true,
    },

    open:  function(e){
        var that = this,
            id = e.currentTarget.dataset.id;
        wx.showActionSheet({
            itemList: ['删除此海报'],
            success: function(res) {
                if (!res.cancel) {
                    that.openConfirm(id)
                }
            }
        });
    },
    openConfirm: function (activity_id) {
        var that = this;
        wx.showModal({
            title: '确认删除',
            content: '删除此首页海报',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在删除...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/deleteHomePoster`,
                        data: {
                            activity_id: activity_id
                        },
                        login: true,
                        success () {
                            that.refresh();
                        },
                        fail (error) {
                            console.log('request fail', error);
                            util.showModel('出错了',error.message);
                        }
                    })
                }else{

                }
            }
        });
    },

    choose: function(e){
        var that = this,
            id = e.currentTarget.dataset.id;
        wx.showActionSheet({
            itemList: ['选为首页海报'],
            success: function(res) {
                if (!res.cancel) {
                    that.openChooseConfirm(id)
                }
            }
        });
    },
    openChooseConfirm: function (activity_id) {
        var that = this;
        wx.showModal({
            title: '确认选择',
            content: '将此活动选为首页海报',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在请求...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/addHomePoster`,
                        data: {
                            activity_id: activity_id
                        },
                        login: true,
                        success () {
                            that.refresh();
                        },
                        fail (error) {
                            console.log('request fail', error);
                            util.showModel('出错了',error.message);
                        }
                    })
                }else{

                }
            }
        });
    },
    refresh: function () {
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getHomePosterList`,
            success (result) {

                that.setData({
                    posterList: result.data
                });

                util.showSuccess('加载成功');

            },
            fail (error) {
                console.log('request fail', error);
            }
        });

    },



    loadMore: function () {
        if (!this.data.canLoadMore) { return; }

        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAllActivityList`,
            data: {
                offset: that.data.offset
            },
            success (result) {
                if (result.data.length === 0) {
                    that.setData( {canLoadMore: false} );
                    return;
                }

                that.setData({
                    activityList: that.data.activityList.concat(result.data),
                    offset: result.data[result.data.length-1].activity_id
                });

            },
            fail (error) {
                console.log('request fail', error);
            }
        });

    },

    onLoad: function (options) {
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getHomePosterList`,
            success (result) {

                that.setData({
                    posterList: result.data
                });

            },
            fail (error) {
                console.log('request fail', error);
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getAllActivityList`,
            success (result) {

                that.setData({
                    activityList: result.data,
                    offset: result.data[result.data.length-1].activity_id
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
