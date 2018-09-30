var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        association_id: null,

        date_start: null,
        date_end: null,

        categories: null,
        categoryIndex: 0,

        activity_name: null,
        activity_intro: null,

        imgUrl: null,
        ticket: false
    },

    activity_name: function(e){
        this.data.activity_name = e.detail.value;
    },

    activity_intro: function(e){
        this.data.activity_intro = e.detail.value;
    },

    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    bindCategoryChange: function(e) {
        this.setData({
            categoryIndex: e.detail.value
        })
    },
    bindTicketChange: function(e) {
        this.setData({
            ticket: !this.data.ticket
        });
    },


    // 上传图片接口
    doUpload: function () {
        var that = this;

        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res){
                util.showBusy('正在上传');
                var filePath = res.tempFilePaths[0];

                // 上传图片
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function(res){
                        util.showSuccess('上传图片成功');
                        res = JSON.parse(res.data);
                        that.setData({
                            imgUrl: res.data.imgUrl
                        })
                    },

                    fail: function() {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function(e) {
                console.error(e)
            }
        })
    },
    // 预览图片
    previewImg: function () {
        wx.previewImage({
            current: this.data.imgUrl,
            urls: [this.data.imgUrl]
        })
    },


    submit: function(){
        this.openConfirm()
    },
    openConfirm: function () {
        var that = this;

        wx.showModal({
            title: '确认创建',
            content: '创建活动',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                console.log(that.data);
                if (res.confirm) {
                    util.showBusy('正在创建...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/addAssociationActivity`,
                        data: {
                            id: that.data.association_id,//社团id，只能叫id，中间键变量没写好
                            date: that.data.date,
                            time: that.data.time + ':00',
                            category: that.data.categories[that.data.categoryIndex],
                            activity_name: that.data.activity_name,
                            activity_intro: that.data.activity_intro,
                            image_src: that.data.imgUrl,
                            ticket: Number(that.data.ticket)
                        },
                        login: true,
                        success (res) {
                            console.log(res);
                            wx.navigateBack();
                            util.showSuccess('创建成功');
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



    onLoad: function (options) {
        var date = new Date();
        this.setData({
            association_id: options.id,
            categories: getApp().data.activity_categories,
            date_start: date.getFullYear() + '-' + (date.getMonth()+1) + '-'+date.getDate(),
            date_end: (date.getFullYear() + 1) + '-' + 12 + '-' + 31
        });
        console.log(this.data.date_start);
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
