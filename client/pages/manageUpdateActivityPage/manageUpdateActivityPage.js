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

        ticket_num_origin: 0,

        activity_name: '',
        activity_intro: '',
        date: '',
        time: '',
        location: '',
        imgUrl: '',
        ticket: false,
        ticket_num: 0,
        offline: false
    },

    checkInput: function () {
        if (!!(this.data.activity_name && this.data.activity_intro && this.data.location && this.data.imgUrl)) { return true; }
        util.showModel('有信息没有填写', '请认真检查并仔细填写所有信息');
        return false;
    },

    checkTicket: function () {
        if ( this.data.ticket_num >= this.data.ticket_num_origin ) { return true; }
        this.setData( {ticket_num: this.data.ticket_num_origin} );
        util.showModel('电子票数量不可比原数量少', '已恢复原数量，请认真检查并仔细填写所有信息');
        return false;
    },

    activity_name: function(e){
        this.data.activity_name = e.detail.value;
    },

    location: function(e){
        this.data.location = e.detail.value;
    },

    activity_intro: function(e){
        this.data.activity_intro = e.detail.value;
    },

    ticket_num: function(e){
        this.data.ticket_num = e.detail.value;
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
        util.showModel('无法修改','此项无法修改');
    },

    bindOfflineChange: function(e) {
        this.setData({
            offline: !this.data.offline
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
        if (!this.checkInput()) { return; }
        if (!this.checkTicket()) { return; }
        this.openConfirm();
    },
    openConfirm: function () {
        var that = this;

        wx.showModal({
            title: '确认修改',
            content: '修改活动信息',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在提交...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/updateAssociationActivity`,
                        data: {
                            id: that.data.association_id,//社团id，只能叫id，中间键变量没写好
                            activity_id: that.data.activity_id,
                            location: that.data.location,
                            date: that.data.date,
                            time: that.data.time + ':00',
                            category: that.data.categories[that.data.categoryIndex],
                            activity_name: that.data.activity_name,
                            activity_intro: that.data.activity_intro,
                            image_src: that.data.imgUrl,
                            ticket: Number(that.data.ticket),
                            ticket_num: that.data.ticket_num,
                            offline: Number(that.data.offline)
                        },
                        login: true,
                        success (res) {
                            wx.navigateBack();
                            util.showSuccess('修改成功');
                        },
                        fail (error) {
                            console.log('request fail', error);
                            util.showModel('出错了', error.message);
                        }
                    })
                }

            }
        });
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

        console.log(that.data);

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
                    categoryIndex: categoryIndex,
                    date: result.data.date,
                    time: result.data.time,
                    location: result.data.location,
                    imgUrl: result.data.image_src,
                    ticket: !!(result.data.ticket),
                    offline: !!(result.data.offline)
                });

            },
            fail (error) {
                console.log('request fail', error);
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getActivityTicketDetail`,
            data: {
                activity_id: that.data.activity_id
            },
            success (result) {

                that.setData({
                    ticket_num_origin: result.data.total,
                    ticket_num: result.data.total
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
