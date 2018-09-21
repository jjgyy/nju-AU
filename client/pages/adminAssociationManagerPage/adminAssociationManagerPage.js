var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        association_id: null,

        managerList: null
    },
    onLoad: function (options) {
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
                var managerList = result.data;
                for (var i=0, len=managerList.length; i<len; i++) {
                    managerList[i].user_info = JSON.parse(managerList[i].user_info);
                }

                that.setData({
                    managerList: managerList
                })
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
