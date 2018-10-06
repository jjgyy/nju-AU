var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        activityList: null,
        offset: 0,

        canLoadMore: true,
        canRefresh: true
    },

    toActivityDetailPage: function (e) {
        wx.navigateTo({
            url: '../activityDetailPage/activityDetailPage?' + 'activity_id=' + e.currentTarget.dataset.id
        })
    },

    refresh: function () {
        if (!this.data.canRefresh) {
            wx.showLoading({
                title: '刷新太频繁啦'
            });
            setTimeout(() => {wx.hideLoading()}, 500);
            return;
        }
        var that = this;

        this.setData({
            canRefresh: false
        });

        setTimeout(function () {
            that.setData({
                canRefresh: true
            })
        }, 10000);

        wx.showLoading({
            title: '刷新中...'
        });

        wx.request({
            url: `${config.service.host}/weapp/getAllActivityList`,
            success (result) {

                that.setData({
                    activityList: result.data,
                    offset: result.data[result.data.length-1].activity_id,
                    canLoadMore: true
                });
                util.showSuccess('刷新成功');

            },
            fail (error) {
                console.log('request fail', error);
            }
        });

    },


    onLoad: function (options) {
        var that = this;

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

    },

    onPullDownRefresh:function () {
        this.refresh();
        wx.stopPullDownRefresh();
    },

    onReachBottom:function () {
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

    }

});
