var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data:{
        category: null,
        associationList: null,
        joinedAssociationList: null
    },
    toAssociationDetailPage: function (e) {
        wx.navigateTo({
            url: '../associationDetailPage/associationDetailPage?' + 'id=' + e.currentTarget.dataset.id
        })
    },
    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        that.setData({
            category: options.category,
            joinedAssociationList: options.joinedAssociationList
        });
        wx.request({
            url: `${config.service.host}/weapp/getAssociationListByCategory`,
            data: {
                category: options.category
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                that.setData({
                    associationList: res.data
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
