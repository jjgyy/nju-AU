var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: null,
        userIdentity: null,

        association_id: null,

        chiefList: null,
        normalList: null,

        search_id: null,
        searchList: null
    },

    search_id: function (e) {
        this.data.search_id = e.detail.value;
    },

    search: function () {
        wx.showLoading('正在查询...');
        var that = this;
        wx.request({
            url: `${config.service.host}/weapp/getUser`,
            data: {
                open_id: that.data.search_id
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

    scanQR: function () {
        var that = this;
        wx.scanCode({
            success: (res) => {
                that.setData({
                    search_id: res.result
                });
                that.search();
            }
        });
    },


    openNormal: function(e){
        var that = this,
            open_id = e.currentTarget.dataset.id;
        wx.showActionSheet({
            itemList: ['移除此管理员', '转让组长'],
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0){
                        that.openDeleteConfirm(open_id);
                    } else {
                        that.openUpConfirm(open_id);
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
                        url: `${config.service.host}/weapp/deleteAssociationNormalManager`,
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
            title: '警告',
            content: '将此用户升为管理组组长，这将使您变为普通管理员，此操作将不可撤销！',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在设置...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/updateAssociationChief`,
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
                            util.showModel('出错了','转让错误');
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
                        url: `${config.service.host}/weapp/addAssociationNormalManager`,
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
                    managerList[i].open_id === that.data.userInfo.openId ? that.setData({userIdentity: that.translateIdentity(managerList[i].identity)}) : null;
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



    translateIdentity: function (identity) {
        return (identity === 'chief') ? '管理组组长' : '普通管理员';
    },

    onLoad: function (options) {

        wx.showLoading('加载中...');

        this.setData({
            association_id: options.id,
            userInfo: getApp().data.userInfo,
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
                    managerList[i].open_id === that.data.userInfo.openId ? that.setData({userIdentity: that.translateIdentity(managerList[i].identity)}) : null;
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
