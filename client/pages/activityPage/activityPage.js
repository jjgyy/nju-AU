var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

import { $stopWuxRefresher } from '../../utils/WuxUI/index.js'

Page({
    data: {
        activityList: null,
        offset: 0,

        likeDic: {},

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

                console.log(that.data.momentList)
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




    like: function (e) {

        var likeWhich = 'likeDic[' + e.currentTarget.dataset.id + ']';
        //赞过的就取消赞
        if (this.data.likeDic[e.currentTarget.dataset.id]) {
            this.setData({
                [likeWhich]: false
            });
            return;
        }
        //没赞过的点赞
        this.setData({
            [likeWhich]: true
        });

    },


    previewImage: function(e){
        var that = this;
        console.log(that.data.momentList[e.currentTarget.dataset.index]);
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: that.data.momentList[e.currentTarget.dataset.index].image_list // 需要预览的图片http链接列表
        })
    },




    refreshActivities: function () {

        var that = this;

        this.setData({
            canRefreshActivities: false
        });

        setTimeout(function () {
            that.setData({
                canRefreshActivities: true
            })
        }, 10000);


        wx.request({
            url: `${config.service.host}/weapp/getAllActivityList`,
            success (result) {

                that.setData({
                    activityList: result.data,
                    offset: result.data[result.data.length-1].activity_id,
                    canLoadMoreActivities: true
                });

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
    }

});
