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
        util.showBusy('加载中...');
        wx.request({
            url: `${config.service.host}/weapp/getAssociationMomentList`,
            data: {
                association_id: that.data.association_id
            },
            success (res) {
                that.setData({
                    momentList: res.data
                });
                util.showSuccess('加载成功');
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
