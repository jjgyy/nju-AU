var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data:{
        association_id: null,

        categories: null,
        categoryIndex: 0,

        content: null
    },

    content: function(e){
        this.data.content = e.detail.value;
    },


    submit: function(){
        this.openConfirm()
    },
    openConfirm: function () {
        var that = this;

        wx.showModal({
            title: '确认提交',
            content: '提交动态',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在提交...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/addAssociationMoment`,
                        data: {
                            id: that.data.association_id,//社团id，只能叫id，中间键变量没写好
                            category: that.data.categories[that.data.categoryIndex],
                            content: that.data.content
                        },
                        login: true,
                        success () {
                            wx.navigateBack();
                            util.showSuccess('提交成功');
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


    bindCategoryChange: function(e) {
        this.setData({
            categoryIndex: e.detail.value
        })
    },
    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            association_id: options.id,
            categories: getApp().data.moment_categories
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
})
