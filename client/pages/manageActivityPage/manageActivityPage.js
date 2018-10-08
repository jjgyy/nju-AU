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

    toActivityDetailPage: function (activity_id) {
        wx.navigateTo({
            url: '../activityDetailPage/activityDetailPage?' + 'activity_id=' + activity_id
        })
    },

    toManageUpdateActivityPage: function (activity_id) {
        var that = this;
        wx.navigateTo({
            url: '../manageUpdateActivityPage/manageUpdateActivityPage?' + 'activity_id=' + activity_id + '&association_id=' + that.data.association_id
        })
    },

    open: function(e){
        var that = this,
            activity_id = e.currentTarget.dataset.id;
        wx.showActionSheet({
            itemList: ['前往活动界面', '修改', '删除'],
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex === 0) {
                        that.toActivityDetailPage(activity_id);
                    }
                    else if (res.tapIndex === 1) {
                        that.toManageUpdateActivityPage(activity_id);
                    }
                    else {
                        that.openDeleteConfirm(activity_id);
                    }
                }
            }
        });
    },
    openDeleteConfirm: function (activity_id) {
        var that = this;
        wx.showModal({
            title: '确认删除',
            content: '警告：将此活动删除，将使得已发放的电子票失效',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在删除...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/deleteAssociationActivity`,
                        data: {
                            id: that.data.association_id,
                            activity_id: activity_id
                        },
                        login: true,
                        success () {
                            util.showSuccess('删除成功');
                            that.refresh();
                        },
                        fail (error) {
                            console.log('request fail', error);
                            util.showModel('出错了',error.message);
                        }
                    })
                }

            }
        });
    },
    refresh: function(){
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
