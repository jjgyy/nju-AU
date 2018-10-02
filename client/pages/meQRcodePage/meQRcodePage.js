var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');
import drawQrcode from '../../utils/weapp.qrcode.min.js';

Page({
    data: {
        userInfo: {},
        logged: false
    },
    onLoad: function (options) {
        if (getApp().data.logged) {
            this.setData({
                userInfo: getApp().data.userInfo,
                logged: getApp().data.logged
            });
        }

        drawQrcode({
            width: 200,
            height: 200,
            canvasId: 'myQrcode',
            text: this.data.userInfo.openId
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
