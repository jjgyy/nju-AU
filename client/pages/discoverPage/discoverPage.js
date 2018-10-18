var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

import { $stopWuxRefresher } from '../../utils/WuxUI/index.js'

const sliderWidth = 96;

Page({
    data: {
        tabs: ['新鲜事', '活动'],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,

        likeDic: {},

        currentTab: 0,
        clientHeight: null,

        activityList: null,
        activitiesOffset: 0,
        momentList: null,
        momentsOffset: 0,

        needGetMoments: true,
        needGetActivities: true,

        canLoadMoreActivities: true,
        canRefreshActivities: true,

        canLoadMoreMoments: true,
        canRefreshMoments: true

    },

    toActivityDetailPage: function (e) {
        wx.navigateTo({
            url: '../activityDetailPage/activityDetailPage?' + 'activity_id=' + e.currentTarget.dataset.id
        })
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


    tabClick: function (e) {
        const { offsetLeft, dataset } = e.currentTarget;
        const { id } = dataset;

        this.setData({
            sliderOffset: offsetLeft,
            activeIndex: id,
        });

        this.lazyLoad();
    },


    //页面加载
    onLoad: function () {
        var that = this;

        wx.getSystemInfo({
            success(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                })
            }
        });

        this.lazyLoad();
    },


    lazyLoad: function () {
        switch (this.data.activeIndex) {
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
                    momentList[i].date = that.dateParser(momentList[i].date);
                }
                that.setData({
                    momentList: momentList,
                    momentsOffset: result.data[result.data.length-1].moment_id,
                    needGetMoments: false,
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
                    activitiesOffset: result.data[result.data.length-1].activity_id,
                    needGetActivities: false
                });
            },
            fail (error) {
                console.log('request fail', error);
            }
        });

    },


    pullDownRefresh: function () {
        switch (this.data.activeIndex) {
            case 0:
                this.refreshMoments();
                break;
            case 1:
                this.refreshActivities();
                break;
        }
        $stopWuxRefresher();
    },


    onReachBottom:function () {
        switch (this.data.activeIndex) {
            case 0:
                this.loadMoreMoments();
                break;
            case 1:
                this.loadMoreActivities();
                break;
        }
    },


    refreshActivities: function () {
        if (!this.data.canRefreshActivities) { return; }
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
                    activitiesOffset: result.data[result.data.length-1].activity_id,
                    canLoadMoreActivities: true
                });

            },
            fail (error) {
                console.log('request fail', error);
            }
        });

    },


    refreshMoments: function () {
        if (!this.data.canRefreshMoments) { return; }
        var that = this;

        this.setData({
            canRefreshMoments: false
        });

        setTimeout(function () {
            that.setData({
                canRefreshMoments: true
            })
        }, 10000);

        wx.request({
            url: `${config.service.host}/weapp/getAllMomentList`,
            success (result) {
                var momentList = result.data;
                for (var i=0, len=momentList.length; i<len; i++) {
                    momentList[i].image_list = JSON.parse(momentList[i].image_list);
                    momentList[i].date = that.dateParser(momentList[i].date);
                }
                that.setData({
                    momentList: momentList,
                    momentsOffset: result.data[result.data.length-1].moment_id,
                    canLoadMoreMoments: true
                });

            },
            fail (error) {
                console.log('request fail', error);
            }
        });

    },


    loadMoreActivities: function () {
        if (!this.data.canLoadMoreActivities) { return; }
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAllActivityList`,
            data: {
                offset: that.data.activitiesOffset
            },
            success (result) {
                if (result.data.length === 0) {
                    that.setData( {canLoadMoreActivities: false} );
                    return;
                }

                that.setData({
                    activityList: that.data.activityList.concat(result.data),
                    activitiesOffset: result.data[result.data.length-1].activity_id
                });
            },
            fail (error) {
                console.log('request fail', error);
            }
        });

    },


    loadMoreMoments: function () {
        if (!this.data.canLoadMoreMoments) { return; }
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAllMomentList`,
            data: {
                offset: that.data.momentsOffset
            },
            success (result) {
                if (result.data.length === 0) {
                    that.setData( {canLoadMoreMoments: false} );
                    return;
                }

                var momentList = result.data;
                for (var i=0, len=momentList.length; i<len; i++) {
                    momentList[i].image_list = JSON.parse(momentList[i].image_list);
                    momentList[i].date = that.dateParser(momentList[i].date);
                }
                that.setData({
                    momentList: that.data.momentList.concat(momentList),
                    momentsOffset: result.data[result.data.length-1].moment_id
                });
            },
            fail (error) {
                console.log('request fail', error);
            }
        });

    },


    dateParser: function (timestamp) {
        var interval = ( Date.parse(new Date()) - Date.parse(timestamp) ) / 1000;

        if (interval < 3600) {
            return '刚刚';
        }
        if ((interval/3600) < 24) {
            return parseInt(interval/3600) + '小时前';
        }
        if ((interval/86400) < 8) {
            return parseInt(interval/86400) + '天前';
        }
        return timestamp.substr(5, 5);
    },


});

/*
Page({
    data: {
        activityList: null,
        activitiesOffset: 0,

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
                    activitiesOffset: result.data[result.data.length-1].activity_id,
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
                    activitiesOffset: result.data[result.data.length-1].activity_id,
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
                activitiesOffset: that.data.activitiesOffset
            },
            success (result) {
                if (result.data.length === 0) {
                    that.setData( {canLoadMoreActivities: false} );
                    return;
                }

                that.setData({
                    activityList: that.data.activityList.concat(result.data),
                    activitiesOffset: result.data[result.data.length-1].activity_id
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
*/
