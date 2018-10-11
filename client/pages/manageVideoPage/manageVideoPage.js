var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data: {
        association_id: null,
        vid: ''
    },

    vid: function(e){
        this.data.vid = e.detail.value;
    },


    submit: function(){
        if (this.data.vid.substr(-5, 5) == '.html') {
            this.setData( {vid: this.data.vid.substr(-16, 11)} );
            console.log(this.data.vid);
        }
        this.openConfirm()
    },
    openConfirm: function () {
        var that = this;

        wx.showModal({
            title: '确认修改',
            content: '修改社团宣传视频',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    util.showBusy('正在提交...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/updateAssociationVideo`,
                        data: {
                            id: that.data.association_id,
                            vid: that.data.vid
                        },
                        login: true,
                        success () {
                            util.showSuccess('修改成功');
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

        util.showBusy('加载中...');

        var that = this;

        this.setData({
            association_id: options.id
        });

        wx.request({
            url: `${config.service.host}/weapp/getAssociationVideo`,
            data: {
                association_id: options.id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                res.data.vid !== undefined && that.setData( {vid: res.data.vid} );
                util.showSuccess('加载成功');
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
