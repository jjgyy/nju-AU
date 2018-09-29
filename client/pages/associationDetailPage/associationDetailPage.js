var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data:{
        association_id: null,
        associationDetail: {},
        associationQQList: [],
        associationOfficialList: [],
        articleList: null,

        hasJoined: false,

        joinBtnText: '+ 关注',

        needGetMoments: true,
        needGetArticles: true,

        currentTab: 0,
        clientHeight: null,
        tabWordColor: ['#097aff', '#bbbbbb', '#bbbbbb'],
        tabLineColor: ['#097aff', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']
    },

    toArticleDetailPage: function (e) {
        wx.navigateTo({
            url: '../articleDetailPage/articleDetailPage?' + 'url=' + e.currentTarget.dataset.url,
        })
    },


    copy: function (e) {
        var copydata = e.currentTarget.dataset.copydata;
        wx.setClipboardData({
            data: copydata
        })
    },


    join: function () {
        this.openConfirm(this.data.association_id);
    },
    openConfirm: function (id) {
        var that = this;
        wx.showModal({
            title: '确认加入',
            content: '将此社团加入到我的社团',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        hasJoined: true,
                        joinBtnText: '已关注'
                    });
                    wx.request({
                        url: `${config.service.host}/weapp/addAssociationJoiner`,
                        data: {
                            association_id: id,
                            open_id: getApp().data.userInfo.openId
                        },
                        login: true,
                        success () {
                            getApp().data.needRefreshJoined = true; // 有修改后将全局变量置为true
                        },
                        fail (error) {
                            console.log('request fail', error);
                            util.showModel('出错了', error.message);
                        }
                    })
                }else{
                }
            }
        });
    },


    clickIntroTab: function () {
        this.setData({
            currentTab: 0
        })
    },

    clickMomentTab: function () {
        this.setData({
            currentTab: 1
        });
        this.lazyGetMoments();
    },

    clickArticleTab: function () {
        this.setData({
            currentTab: 2
        });
        this.lazyGetArticles();
    },


    switchPage: function (e) {
        this.setData({
            currentTab: e.detail.current
        });

        switch (this.data.currentTab) {
            case 0:
                this.setData({
                    tabWordColor: ['#097aff', '#bbbbbb', '#bbbbbb'],
                    tabLineColor: ['#097aff', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']
                });
                break;
            case 1:
                this.setData({
                    tabWordColor: ['#bbbbbb', '#097aff', '#bbbbbb'],
                    tabLineColor: ['rgba(0,0,0,0)', '#097aff', 'rgba(0,0,0,0)']
                });
                this.lazyGetMoments();
                break;
            case 2:
                this.setData({
                    tabWordColor: ['#bbbbbb', '#bbbbbb', '#097aff'],
                    tabLineColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', '#097aff']
                });
                this.lazyGetArticles();
                break;
        }

    },


    lazyGetMoments: function () {
        if (!this.data.needGetMoments) { return; }
        var that = this;
        wx.request({
            url: `${config.service.host}/weapp/getAssociationMomentList`,
            data: {
                association_id: that.data.association_id
            },
            success(result) {
                var momentList = result.data;
                for (var i=0, len=momentList.length; i<len; i++) {
                    momentList[i].image_list = JSON.parse(momentList[i].image_list);
                    momentList[i].date = momentList[i].date.substr(0, 10);
                    momentList[i].like = false;
                }
                that.setData({
                    momentList: momentList,
                    needGetMoments: false
                });
            },
            fail(error) {
                console.log('request fail', error);
            }
        });
    },


    lazyGetArticles: function () {
        if (!this.data.needGetArticles) { return; }
        var that = this;
        wx.request({
            url: `${config.service.host}/weapp/getAssociationArticleList`,
            data: {
                association_id: that.data.association_id
            },
            success (res) {
                var articleList = res.data.data;
                for (var i=0, len=articleList.length; i<len; i++) {
                    articleList[i].date = articleList[i].date.substr(0, 10);
                }
                that.setData({
                    articleList: articleList,
                    needGetArticles: false
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        })
    },


    onLoad:function(options){
        var that = this;

        this.setData({
            association_id: options.id
        });

        if(options.hasJoined === 'true'){
            this.setData({
                hasJoined: true,
                joinBtnText: '已关注'
            })
        } else{
            this.setData({
                hasJoined: false,
                joinBtnText: '+ 关注'
            })
        }

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    clientHeight: res.windowHeight
                });
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getAssociationDetail`,
            data: {
                id: options.id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                that.setData({
                    associationDetail: res.data.data
                })
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getAssociationContact`,
            data: {
                id: options.id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                that.setData({
                    associationQQList: res.data.data.associationQQList,
                    associationOfficialList: res.data.data.associationOfficialList
                })
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
    }
});
