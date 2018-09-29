var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data:{
        association_id: null,
        momentList: null
    },

    toManageWriteMomentPage: function () {
        wx.navigateTo({
            url: '../manageWriteMomentPage/manageWriteMomentPage?' + 'id=' + this.data.association_id
        })
    },

    open: function(e){
        var that = this,
            id = e.currentTarget.dataset.id;
        wx.showActionSheet({
            itemList: ['删除'],
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex === 0){
                        that.openDeleteConfirm(id);
                    }
                }
            }
        });
    },
    openDeleteConfirm: function (id) {
        var that = this;
        wx.showModal({
            title: '确认删除',
            content: '将此动态删除',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    qcloud.request({
                        url: `${config.service.host}/weapp/deleteAssociationMoment`,
                        data: {
                            id: that.data.association_id,
                            moment_id: id
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
    refresh: function(){
        util.showBusy('加载中...');
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAssociationMomentList`,
            data: {
                association_id: that.data.association_id
            },
            success (result) {
                var momentList = result.data;
                for (var i=0, len=momentList.length; i<len; i++) {
                    momentList[i].image_list = JSON.parse(momentList[i].image_list);
                    momentList[i].date = momentList[i].date.substr(0, 10);
                }
                that.setData({
                    momentList: momentList
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });
    },

    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            association_id: options.id
        });
    },
    onReady:function(){
        // 页面渲染完成
    },
    onShow:function(){
        // 页面显示
        var that = this;
        wx.request({
            url: `${config.service.host}/weapp/getAssociationMomentList`,
            data: {
                association_id: that.data.association_id
            },
            success (result) {
                var momentList = result.data;
                for (var i=0, len=momentList.length; i<len; i++) {
                    momentList[i].image_list = JSON.parse(momentList[i].image_list);
                    momentList[i].date = momentList[i].date.substr(0, 10);
                }
                that.setData({
                    momentList: momentList
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        })
    },
    onHide:function(){
        // 页面隐藏
    },
    onUnload:function(){
        // 页面关闭
    }
});
