var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        nick_name: null,

        userList: null
    },

    nick_name: function(e){
        this.data.nick_name = e.detail.value;
    },

    search: function () {
        wx.showLoading('正在查询...');
        var that = this;
        wx.request({
            url: `${config.service.host}/weapp/searchUser`,
            data: {
                nick_name: that.data.nick_name
            },
            success (result) {
                var userList = result.data;
                for (var i=0, len=userList.length; i<len; i++) {
                    userList[i].user_info = JSON.parse(userList[i].user_info);
                }
                console.log(userList);
                that.setData({
                    userList: userList
                });
                setTimeout(() => {
                    wx.hideLoading();
                }, 0);
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        })
    },

    open: function(e){
        var that = this,
            id = e.currentTarget.dataset.id;
        wx.showActionSheet({
            itemList: ['复制ID', '管理用户'],
            success: function(res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0){
                        wx.setClipboardData({
                            data: id
                        });
                    } else {
                        //TODO: 增加管理用户界面
                    }
                }
            }
        });
    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
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
})
