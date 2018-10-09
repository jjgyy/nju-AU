import drawQrcode from "../../utils/weapp.qrcode.min";

var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        activity_id: null
    },
    onLoad: function (options) {
        var that = this;

        that.setData({
            activity_id: options.id
        });

        drawQrcode({
            width: 200,
            height: 200,
            canvasId: 'activityQrcode',
            text: '{"type":"activity","id":"' + that.data.activity_id + '"}'
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
