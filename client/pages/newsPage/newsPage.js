var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data:{
        requestResult: '',
        posterList: null,

        articleList: null,
        offset: 0,

        canLoadMore: true,

        canRefresh: true,
    },

    toActivityDetailPage: function (e) {
        wx.navigateTo({
            url: '../activityDetailPage/activityDetailPage?' + 'activity_id=' + e.currentTarget.dataset.id
        })
    },

    toArticleDetailPage: function (e) {
        this.updateArticleRead(e.currentTarget.dataset.id);
        wx.navigateTo({
            url: '../articleDetailPage/articleDetailPage?' + 'url=' + e.currentTarget.dataset.url,
        })
    },


    dateParser: function (timestamp) {
        var interval = ( Date.parse(new Date()) - Date.parse(timestamp) ) / 1000;

        if (interval < 3600) {
            return '刚刚';
        }
        if ((interval/3600) < 24) {
            return parseInt(interval/3600) + '小时前';
        }
        if ((interval/86400) < 4) {
            return parseInt(interval/86400) + '天前';
        }
        return timestamp.substr(0, 10);
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
            url: `${config.service.host}/weapp/getAllArticleList`,
            success (res) {
                var articleList = res.data.data;
                for (var i=0, len=articleList.length; i<len; i++) {
                    articleList[i].date = that.dateParser(articleList[i].date);
                }
                that.setData({
                    articleList: articleList,
                    offset: articleList[articleList.length-1].id,
                    canLoadMore: true
                });
                util.showSuccess('刷新成功');
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        })
    },


    updateArticleRead: function (article_id) {

        wx.request({
            url: `${config.service.host}/weapp/updateArticleRead`,
            data: {
                article_id: article_id
            },
            success (res) {
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });

    },


    onLoad:function(options){
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
            url: `${config.service.host}/weapp/getAllArticleList`,
            success (res) {
                var articleList = res.data.data;
                for (var i=0, len=articleList.length; i<len; i++) {
                    articleList[i].date = that.dateParser(articleList[i].date);
                }

                that.setData({
                    articleList: articleList,
                    offset: articleList[articleList.length-1].id
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });

    },
    onReady:function(){
        // 页面渲染完成
    },
    onShow:function(){
        // 页面显示
    },
    onHide:function(){
        // 页面隐藏
    },
    onUnload:function(){
        // 页面关闭
    },

    onPullDownRefresh:function () {
        this.refresh();
        wx.stopPullDownRefresh();
    },

    onReachBottom:function () {
        if (!this.data.canLoadMore) { return; }

        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAllArticleList`,
            data: {
                offset: that.data.offset
            },
            success (res) {
                if (res.data.data.length === 0) {
                    that.setData( {canLoadMore: false} );
                    return;
                }
                var articleList = res.data.data;
                for (var i=0, len=articleList.length; i<len; i++) {
                    articleList[i].date = that.dateParser(articleList[i].date);
                }
                that.setData({
                    articleList: that.data.articleList.concat(articleList),
                    offset: articleList[articleList.length-1].id
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });

    }


});
