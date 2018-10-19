var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

Page({
    data:{
        association_id: null,

        uploadUrl: config.service.uploadUrl,

        content: '',

        files: [],

        fileList: []
    },

    checkInput: function () {
        if (!!(this.data.content)) { return true; }
        util.showModel('有信息没有填写', '请认真检查并仔细填写所有信息');
        return false;
    },

    content: function(e){
        this.data.content = e.detail.value;
    },


    submit: function(){
        if (!this.checkInput()) { return; }
        this.openConfirm();
    },
    openConfirm: function () {
        var that = this;

        wx.showModal({
            title: '确认提交',
            content: '提交动态',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                console.log(that.data.association_id);
                console.log(that.data.content);
                console.log(JSON.stringify(that.data.files));
                if (res.confirm) {
                    util.showBusy('正在提交...');
                    qcloud.request({
                        url: `${config.service.host}/weapp/addAssociationMoment`,
                        data: {
                            id: that.data.association_id,//社团id，只能叫id，中间键变量没写好
                            content: that.data.content,
                            image_list: JSON.stringify(that.data.files)
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


    /*chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            count: 4,
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var filePath = res.tempFilePaths[0];

                // 上传图片
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function(res){
                        util.showSuccess('上传图片成功');
                        res = JSON.parse(res.data);
                        var files = that.data.files;
                        files.push(res.data.imgUrl);
                        that.setData({
                            files: files
                        });
                    },

                    fail: function() {
                        util.showModel('上传图片失败')
                    }
                })
            }
        })

    },
    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },*/


    onChange(e) {
        console.log('onChange', e)
        const { file } = e.detail
        if (file.status === 'uploading') {
            this.setData({
                progress: 0,
            })
            wx.showLoading()
        } else if (file.status === 'done') {
            this.setData({
                imageUrl: file.url,
            })
        }
    },
    onSuccess(e) {
        console.log('onSuccess', e)
    },
    onFail(e) {
        console.log('onFail', e)
    },
    onComplete(e) {
        console.log('onComplete', e);
        const res = JSON.parse(e.detail.data);
        this.data.files.push(res.data.imgUrl);
        console.log(this.data.files);
        wx.hideLoading();
    },
    onProgress(e) {
        console.log('onProgress', e);
        this.setData({
            progress: e.detail.file.progress,
        })
    },
    onPreview(e) {
        console.log('onPreview', e);
        const { file, fileList } = e.detail
        wx.previewImage({
            current: file.url,
            urls: fileList.map((n) => n.url),
        })
    },
    onRemove(e) {
        this.data.files.splice(e.detail.index, 1);
        console.log(this.data.files);
    },


    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            association_id: options.id,
            categories: getApp().data.moment_categories
        })
    }

})
