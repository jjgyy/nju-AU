var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data:{
        associationList: [],
        userAssociationList: null,
        recommendAssociationList: null,
        momentList: [],
        activityList: [],

        expand: false,

        likeDic: {},

        needGetAssociations: true,
        needGetActivities: true,
        needGetMoments: true,

        canRefresh: true,

        currentTab: 0,
        clientHeight: null,
        tabWordColor: ['#097aff', '#bbbbbb'],
        tabLineColor: ['#097aff', 'rgba(0,0,0,0)'],

        inputShowed: false,
        inputVal: "",
        searchResult: []
    },


    toAssociationDetailPage: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../associationDetailPage/associationDetailPage?' + 'id=' + id
        })
    },

    toAssociationCategoryPage: function (e) {
        var category = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../associationCategoryPage/associationCategoryPage?' + 'category=' + category
        })
    },

    expand: function () {
        this.setData( {expand: !this.data.expand} )
    },


    clickSearchTab: function () {
        this.setData({
            currentTab: 0
        });
        this.lazyLoad();
    },

    clickMomentTab: function () {
        this.setData({
            currentTab: 1
        });
        this.lazyLoad();
    },


    switchPage: function (e) {
        this.setData({
            currentTab: e.detail.current
        });

        switch (this.data.currentTab) {
            case 0:
                this.setData({
                    tabWordColor: ['#097aff', '#bbbbbb'],
                    tabLineColor: ['#097aff', 'rgba(0,0,0,0)']
                });
                break;
            case 1:
                this.setData({
                    tabWordColor: ['#bbbbbb', '#097aff'],
                    tabLineColor: ['rgba(0,0,0,0)', '#097aff']
                });
                break;
        }

        this.lazyLoad();
    },


    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
        var reg = new RegExp(this.data.inputVal);
        var searchResult = [];
        for(var i=0, resultLength=0, length=this.data.associationList.length; i<length&&resultLength<4; i++){
            //如果字符串中不包含目标字符会返回-1
            if(this.data.associationList[i].name.match(reg)){
                searchResult.push({
                    id: this.data.associationList[i].id,
                    name: this.data.associationList[i].name
                });
                resultLength ++;
            }
        }
        this.setData({
            searchResult: searchResult
        });
    },

    lazyLoad: function () {
        switch (this.data.currentTab) {
            case 0:
                this.lazyGetAssociations();
                break;
            case 1:
                this.lazyGetMoments();
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


    lazyGetAssociations: function () {

        if (!this.data.needGetAssociations) { return; }
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAssociationList`,
            success(result) {
                that.setData({
                    associationList: result.data.data,
                    needGetAssociations: false
                })
            },
            fail(error) {
                console.log('request fail', error);
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getRecommendAssociationList`,
            success(result) {
                that.setData({
                    recommendAssociationList: result.data.data,
                })
            },
            fail(error) {
                console.log('request fail', error);
            }
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
                util.showSuccess('刷新成功');
            },
            fail(error) {
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


    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
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

    onReady:function(){

    },
    onShow:function(){
        var that = this;

        if( this.data.userAssociationList == null || getApp().data.needRefreshJoined ) {

            wx.request({
                url: `${config.service.host}/weapp/getUserAssociationList`,
                data: {
                    open_id: getApp().data.userInfo.openId
                },
                success (result) {

                    that.setData({
                        userAssociationList: result.data.data
                    });
                    // 刷新成功后将全局变量置为false
                    getApp().data.needRefreshJoined = false;
                },
                fail (error) {
                    console.log('request fail', error);
                }
            });
        }

    },
    onHide:function(){

    },
    onUnload:function(){

    }




});
