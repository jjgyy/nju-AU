var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data:{
        requestResult: '',
        posterTexts:["一柒一会，我们收获了什么","创投干货：对话投资人"],
        posterImage:["./poster1.jpeg","./poster2.jpg"],

        articleList: null
    },

    toArticleDetailPage: function (e) {
        wx.navigateTo({
            url: '../articleDetailPage/articleDetailPage?' + 'url=' + e.currentTarget.dataset.url,
        })
    },

    refresh: function () {
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAllArticleList`,
            success (res) {
                that.setData({
                    articleList: res.data.data
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        })
    },

    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAllArticleList`,
            success (res) {
                that.setData({
                    articleList: res.data.data
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
    }
});
