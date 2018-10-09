var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');
import drawQrcode from "../../utils/weapp.qrcode.min";

Page({
    data: {
        association_id: null,
        associationDetail: null
    },
    onLoad: function (options) {
        var that = this;

        that.setData({
            association_id: options.id
        });

        wx.request({
            url: `${config.service.host}/weapp/getAssociationDetail`,
            data: {
                id: options.id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                that.setData({
                    associationDetail: res.data.data
                })
            }
        });

        drawQrcode({
            width: 200,
            height: 200,
            canvasId: 'associationQrcode',
            text: '{"type":"association","id":"' + that.data.association_id + '"}'
        });
    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    }
});
