var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        activityList: null,
        offset: 0,

        currentTab: 0,
        clientHeight: null,

        needGetMoments: true,
        needGetActivities: true,

        canLoadMoreActivities: true,
        canRefreshActivities: true
    },

    toActivityDetailPage: function (e) {
        wx.navigateTo({
            url: '../activityDetailPage/activityDetailPage?' + 'activity_id=' + e.currentTarget.dataset.id
        })
    },



    switchPage: function (e) {

        this.setData({
            currentTab: e.detail.current
        });

        this.lazyLoad();

    },

    switchTab(e) {

        this.setData({
            currentTab: e.detail.key,
        })

    },




    lazyLoad: function () {
        switch (this.data.currentTab) {
            case 0:
                this.lazyGetMoments();
                break;
            case 1:
                this.lazyGetActivities();
                break;
        }
    },


    lazyGetMoments: function () {
        if (!this.data.needGetMoments) { return; }
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAllMomentList`,
            success(result) {
                var momentList = result.data;
                for (var i=0, len=momentList.length; i<len; i++) {
                    momentList[i].image_list = JSON.parse(momentList[i].image_list);
                    momentList[i].date = momentList[i].date.substr(0, 10);
                }
                that.setData({
                    momentList: momentList
                });
            },
            fail(error) {
                console.log('request fail', error);
            }
        });
    },


    lazyGetActivities: function () {

        if (!this.data.needGetActivities) { return; }

        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAllActivityList`,
            success (result) {

                that.setData({
                    activityList: result.data,
                    offset: result.data[result.data.length-1].activity_id,
                    needGetActivities: false
                });

            },
            fail (error) {
                console.log('request fail', error);
            }
        });

    },



    refresh: function () {
        switch (this.data.currentTab) {
            case 0:
                break;
            case 1:
                this.refreshActivities();
                break;
        }
    },


    refreshActivities: function () {

        if (!this.data.canRefreshActivities) {
            wx.showLoading({
                title: '刷新太频繁啦'
            });
            setTimeout(() => {wx.hideLoading()}, 500);
            return;
        }
        var that = this;

        this.setData({
            canRefreshActivities: false
        });

        setTimeout(function () {
            that.setData({
                canRefreshActivities: true
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
                    canLoadMoreActivities: true
                });
                util.showSuccess('刷新成功');

            },
            fail (error) {
                console.log('request fail', error);
            }
        });

    },



    loadMoreActivities:function () {

        if (!this.data.canLoadMoreActivities) { return; }

        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAllActivityList`,
            data: {
                offset: that.data.offset
            },
            success (result) {
                if (result.data.length === 0) {
                    that.setData( {canLoadMoreActivities: false} );
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

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    clientHeight: res.windowHeight
                });
            }
        });

        this.lazyLoad();
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
