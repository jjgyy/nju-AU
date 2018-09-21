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

        joinBtnText: '+ 加入',

        needGetArticles: true,

        currentTab: 0,
        clientHeight: null,
        leftTabColor: '#0f0f0f',
        rightTabColor: '#bbbbbb',
        leftTabLineColor: '#0f0f0f',
        rightTabLineColor: 'rgba(0,0,0,0)'
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
                        joinBtnText: '已加入'
                    });
                    util.showBusy('正在加入...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/addAssociationJoiner`,
                        data: {
                            association_id: id
                        },
                        login: true,
                        success () {
                            util.showSuccess('加入成功');
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


    clickLeftTab: function () {
        this.setData({
            currentTab: 0
        })
    },

    clickRightTab: function () {
        this.setData({
            currentTab: 1
        });
        this.lazyGetArticles();
    },

    switchPage: function (e) {
        this.setData({
            currentTab: e.detail.current
        });
        this.refreshTab();
        this.lazyGetArticles();
    },

    refreshTab: function () {
        if (this.data.currentTab === 0){
            this.setData({
                leftTabColor: '#0f0f0f',
                rightTabColor: '#bbbbbb',
                leftTabLineColor: '#0f0f0f',
                rightTabLineColor: 'rgba(0,0,0,0)'
            });
        }
        else{
            this.setData({
                leftTabColor: '#bbbbbb',
                rightTabColor: '#0f0f0f',
                leftTabLineColor: 'rgba(0,0,0,0)',
                rightTabLineColor: '#0f0f0f'
            });
        }
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
                that.setData({
                    articleList: res.data.data,
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
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        this.setData({
            association_id: options.id
        });

        if(options.hasJoined === 'true'){
            this.setData({
                hasJoined: true,
                joinBtnText: '已加入'
            })
        } else{
            this.setData({
                hasJoined: false,
                joinBtnText: '+ 加入'
            })
        }

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    clientHeight: res.windowHeight * 0.65
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
