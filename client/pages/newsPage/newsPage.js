var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data:{
        requestResult: '',
        posterTexts:["一柒一会，我们收获了什么","创投干货：对话投资人"],
        posterImage:["./poster1.jpeg","./poster2.jpg"],

        articleList: null,

        page: 1,
        canLoadMore: true,

        canRefresh: true
    },

    toArticleDetailPage: function (e) {
        wx.navigateTo({
            url: '../articleDetailPage/articleDetailPage?' + 'url=' + e.currentTarget.dataset.url,
        })
    },

    refresh: function () {
        wx.stopPullDownRefresh();
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
                    articleList[i].date = articleList[i].date.substr(0, 10);
                }
                that.setData({
                    articleList: articleList,
                    page: 1,
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

    onLoad:function(options){
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAllArticleList`,
            success (res) {
                var articleList = res.data.data;
                for (var i=0, len=articleList.length; i<len; i++) {
                    articleList[i].date = articleList[i].date.substr(0, 10);
                }
                that.setData({
                    articleList: articleList
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        })

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
    },

    onReachBottom:function () {
        if (!this.data.canLoadMore) { return; }

        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAllArticleList`,
            data: {
                page: that.data.page
            },
            success (res) {
                if (res.data.data.length === 0) {
                    that.setData( {canLoadMore: false} );
                    return;
                }
                var articleList = res.data.data;
                for (var i=0, len=articleList.length; i<len; i++) {
                    articleList[i].date = articleList[i].date.substr(0, 10);
                }
                that.setData({
                    articleList: that.data.articleList.concat(articleList),
                    page: (that.data.page + 1)
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });

    }


});
