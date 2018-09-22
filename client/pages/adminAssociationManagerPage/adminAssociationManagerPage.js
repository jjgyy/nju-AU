var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        association_id: null,

        chiefList: null,
        normalList: null,

        open_id: null,
        searchList: null
    },

    open_id: function(e){
        this.data.open_id = e.detail.value;
    },

    search: function () {
        wx.showLoading('正在查询...');
        var that = this;
        wx.request({
            url: `${config.service.host}/weapp/getUser`,
            data: {
                open_id: that.data.open_id
            },
            success (result) {
                var searchList = result.data;
                for (var i=0, len=searchList.length; i<len; i++) {
                    searchList[i].user_info = JSON.parse(searchList[i].user_info);
                }
                that.setData({
                    searchList: searchList
                });
                setTimeout(() => {
                    wx.hideLoading();
                }, 0);
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        })
    },

    openNormal: function(e){
        var that = this,
            open_id = e.currentTarget.dataset.id;
        wx.showActionSheet({
            itemList: ['升为管理组组长', '移除此管理员'],
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0){
                        that.openUpConfirm(open_id);
                    } else {
                        that.openDeleteConfirm(open_id);
                    }
                }
            }
        });
    },
    openDeleteConfirm: function (open_id) {
        var that = this;
        wx.showModal({
            title: '确认移除',
            content: '移除此用户的管理员身份',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在移除...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/deleteAssociationNormalManagerByAdmin`,
                        data: {
                            id: that.data.association_id,
                            open_id: open_id
                        },
                        login: true,
                        success () {
                            that.refresh();
                        },
                        fail (error) {
                            console.log('request fail', error);
                            util.showModel('出错了','移除错误');
                        }
                    })
                }else{

                }
            }
        });
    },
    openUpConfirm: function (open_id) {
        var that = this;
        wx.showModal({
            title: '确认',
            content: '将此用户升为管理组组长，这将使原组长变为管理组组员',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在设置...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/updateAssociationChiefByAdmin`,
                        data: {
                            id: that.data.association_id,
                            open_id: open_id
                        },
                        login: true,
                        success () {
                            that.refresh();
                        },
                        fail (error) {
                            console.log('request fail', error);
                            util.showModel('出错了','设置错误');
                        }
                    })
                }else{

                }
            }
        });
    },

    openAdd: function(e){
        var that = this,
            open_id = e.currentTarget.dataset.id;
        wx.showActionSheet({
            itemList: ['设置为管理组组员'],
            success: function(res) {
                if (!res.cancel) {
                    that.openAddConfirm(open_id)
                }
            }
        });
    },
    openAddConfirm: function (open_id) {
        var that = this;
        wx.showModal({
            title: '确认添加',
            content: '将此用户设置为管理组组员',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在设置...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/addAssociationNormalManagerByAdmin`,
                        data: {
                            id: that.data.association_id,
                            open_id: open_id
                        },
                        login: true,
                        success () {
                            that.refresh();
                        },
                        fail (error) {
                            console.log('request fail', error);
                            util.showModel('出错了','添加错误');
                        }
                    })
                }else{

                }
            }
        });
    },
    refresh: function(){
        wx.showLoading('加载中...');
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAssociationManagerList`,
            data: {
                association_id: that.data.association_id
            },
            success(result) {
                var managerList = result.data,
                    chiefList = [],
                    normalList = [];
                for (var i=0, len=managerList.length; i<len; i++) {
                    managerList[i].user_info = JSON.parse(managerList[i].user_info);
                    managerList[i].identity === 'chief' ? chiefList.push(managerList[i]) : normalList.push(managerList[i]);
                }

                that.setData({
                    chiefList: chiefList,
                    normalList: normalList
                });

                setTimeout(() => {
                    wx.hideLoading();
                }, 0);
            },
            fail(error) {
                console.log('request fail', error);
            }
        });
    },

    onLoad: function (options) {
        wx.showLoading('加载中...');

        this.setData({
            association_id: options.association_id
        });

        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAssociationManagerList`,
            data: {
                association_id: that.data.association_id
            },
            success(result) {
                var managerList = result.data,
                    chiefList = [],
                    normalList = [];
                for (var i=0, len=managerList.length; i<len; i++) {
                    managerList[i].user_info = JSON.parse(managerList[i].user_info);
                    managerList[i].identity === 'chief' ? chiefList.push(managerList[i]) : normalList.push(managerList[i]);
                }

                that.setData({
                    chiefList: chiefList,
                    normalList: normalList
                });

                setTimeout(() => {
                    wx.hideLoading();
                }, 0);
            },
            fail(error) {
                console.log('request fail', error);
            }
        });

    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
});
