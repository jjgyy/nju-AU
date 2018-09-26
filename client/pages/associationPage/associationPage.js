var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data:{
        associationList: [],
        userAssociationList: null,
        momentList: null,

        needGetAssociations: true,

        currentTab: 0,
        clientHeight: null,
        leftTabColor: '#097aff',
        rightTabColor: '#cccccc',
        leftTabLineColor: '#097aff',
        rightTabLineColor: 'rgba(0,0,0,0)',

        inputShowed: false,
        inputVal: "",
        searchResult: []
    },

    toAssociationDetailPage: function (e) {
        var id = e.currentTarget.dataset.id;
        var hasJoined = false;
        if(this.data.userAssociationList.length != null) {
            for (var i = 0, length = this.data.userAssociationList.length; i < length; i++) {
                if (id == this.data.userAssociationList[i].id) {
                    hasJoined = true;
                }
            }
        }
        wx.navigateTo({
            url: '../associationDetailPage/associationDetailPage?' + 'id=' + id + '&hasJoined=' + hasJoined
        })
    },

    toAssociationCategoryPage: function (e) {
        var category = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../associationCategoryPage/associationCategoryPage?' + 'category=' + category + '&joinedAssociationList=' + this.data.userAssociationList
        })
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
        this.lazyGetAssociation();
    },

    switchPage: function (e) {
        this.setData({
            currentTab: e.detail.current
        });
        this.refreshTab();
        this.lazyGetAssociation();
    },

    refreshTab: function () {
        if (this.data.currentTab === 0){
            this.setData({
                leftTabColor: '#097aff',
                rightTabColor: '#cccccc',
                leftTabLineColor: '#097aff',
                rightTabLineColor: 'rgba(0,0,0,0)'
            });
        }
        else{
            this.setData({
                leftTabColor: '#cccccc',
                rightTabColor: '#097aff',
                leftTabLineColor: 'rgba(0,0,0,0)',
                rightTabLineColor: '#097aff'
            });
        }
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


    lazyGetAssociation: function () {
        var that = this;

        if(that.data.userAssociationList == null || getApp().data.needRefreshJoined) {
            /**
            wx.showLoading({
                title: '加载中...',
                mask: true
            });
             */

            wx.request({
                url: `${config.service.host}/weapp/getUserAssociationList`,
                data: {
                    open_id: getApp().data.userInfo.openId
                },
                success (result) {

                    that.setData({
                        userAssociationList: result.data.data
                    });

                    getApp().data.needRefreshJoined = false;  // 刷新成功后将全局变量置为false

                    /**
                    setTimeout(() => {
                        wx.hideLoading();
                    }, 0);
                     */

                },
                fail (error) {
                    console.log('request fail', error);
                }
            });
        }

        if (this.data.needGetAssociations) {
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
        }

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

        wx.request({
            url: `${config.service.host}/weapp/getAllMomentList`,
            success(result) {
                that.setData({
                    momentList: result.data.data
                })
            },
            fail(error) {
                console.log('request fail', error);
            }
        });

    },


    onReady:function(){

    },
    onShow:function(){
        var that = this;

        if( (that.data.currentTab === 1) && (this.data.userAssociationList == null || getApp().data.needRefreshJoined) ) {
            /**
            wx.showLoading({
                title: '加载中...',
                mask: true
            });
             */

            wx.request({
                url: `${config.service.host}/weapp/getUserAssociationList`,
                data: {
                    open_id: getApp().data.userInfo.openId
                },
                success (result) {

                    that.setData({
                        userAssociationList: result.data.data
                    });

                    getApp().data.needRefreshJoined = false;  // 刷新成功后将全局变量置为false

                    /**
                    setTimeout(() => {
                        wx.hideLoading();
                    }, 0);
                     */

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
