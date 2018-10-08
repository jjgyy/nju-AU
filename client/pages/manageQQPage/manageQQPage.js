var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data:{
        association_id: null,
        associationQQList: null,

        qq: ''
    },

    checkInput: function() {
        if (!!(this.data.qq)) { return true; }
        util.showModel('新增qq号不可为空', '请认真检查并仔细填写所有信息');
        return false;
    },

    qq: function(e){
        this.data.qq = e.detail.value;
    },

    open: function(e){
        var that = this,
            qq = e.currentTarget.dataset.qq;
        wx.showActionSheet({
            itemList: ['删除'],
            itemColor: '#ee4c3e',
            success: function(res) {
                if (!res.cancel) {
                    that.openDeleteConfirm(qq)
                }
            }
        });
    },
    openDeleteConfirm: function (qq) {
        var that = this;
        wx.showModal({
            title: '确认删除',
            content: '将此qq群号删除',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在删除...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/deleteAssociationQQ`,
                        data: {
                            id: that.data.association_id,
                            qq: qq
                        },
                        login: true,
                        success () {
                            that.refresh();
                        },
                        fail (error) {
                            console.log('request fail', error);
                            util.showModel('出错了',error.message);
                        }
                    })
                }else{

                }
            }
        });
    },

    add: function(){
        if (!this.checkInput()) { return; }
        this.openAddConfirm()
    },
    openAddConfirm: function () {
        var that = this;
        wx.showModal({
            title: '确认添加',
            content: '添加此qq群号',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在添加...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/addAssociationQQ`,
                        data: {
                            id: that.data.association_id,
                            qq: that.data.qq
                        },
                        login: true,
                        success () {
                            that.refresh();
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


    refresh: function(){
        util.showBusy('加载中...');
        var that = this;
        wx.request({
            url: `${config.service.host}/weapp/getAssociationContact`,
            data: {
                id: this.data.association_id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                that.setData({
                    associationQQList: res.data.data.associationQQList
                });
                util.showSuccess('加载成功');
            }
        })
    },

    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
        util.showBusy('加载中...');
        var that = this;
        this.setData({
            association_id: options.id
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
                    associationQQList: res.data.data.associationQQList
                });
                util.showSuccess('加载成功');
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
