var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        association_id: null,
        activity_id: null,

        date_start: null,
        date_end: null,

        categories: null,
        categoryIndex: 0,

        activity_name: '',
        activity_intro: '',
        location: '',
        imgUrl: '',
        ticket: false,
        ticket_num: 0,
        offline: false
    },
    onLoad: function (options) {
        var that = this;

        var date = new Date();
        this.setData({
            association_id: options.association_id,
            activity_id: options.activity_id,
            categories: getApp().data.activity_categories,
            date_start: date.getFullYear() + '-' + (date.getMonth()+1) + '-'+date.getDate(),
            date_end: (date.getFullYear() + 1) + '-' + 12 + '-' + 31
        });

        wx.request({
            url: `${config.service.host}/weapp/getActivityDetail`,
            data: {
                activity_id: that.data.activity_id
            },
            success (result) {

                result.data.date = result.data.date.substr(0, 10);
                result.data.time = result.data.time.substr(0, 5);

                var categoryIndex = 0;
                for(var i=0, length=that.data.categories.length; i<length; i++) {
                    if(that.data.categories[i] === result.data.category){
                        categoryIndex = i;
                        break;
                    }
                }

                that.setData({
                    activity_name: result.data.activity_name,
                    activity_intro: result.data.activity_intro,
                    location: result.data.location,
                    imgUrl: result.data.imgUrl,
                    ticket: !!(result.data.ticket),
                    ticket_num: result.data.ticket_num,
                    offline: !!(result.data.offline)
                });

            },
            fail (error) {
                console.log('request fail', error);
            }
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
