var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    joinedAssociationList: [],
  },

  open: function(e){
    var that = this,
        id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['前往社团主页', '移除该社团'],
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0){
            that.toAssociationDetailPage(id)
          } else {
            that.openConfirm(id)
          }
        }
      }
    });
  },
  toAssociationDetailPage: function (id) {
    var hasJoined = false;
    for(var i=0, length=this.data.joinedAssociationList.length; i<length; i++){
      if(id == this.data.joinedAssociationList[i].id){
        hasJoined = true;
      }
    }
    wx.navigateTo({
      url: '../associationDetailPage/associationDetailPage?' + 'id=' + id + '&hasJoined=' + hasJoined
    })
  },
  openConfirm: function (id) {
    var that = this;
    wx.showModal({
      title: '确认移除',
      content: '将此社团从我的社团中移除',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          util.showBusy('正在移除...');
          qcloud.request({
            url: `${config.service.host}/weapp/deleteUserJoinedAssociation`,
            data: {
              association_id: id
            },
            login: true,
            success () {
              that.refresh();
              getApp().data.needRefreshJoined = true; // 有修改后将全局变量置为true
            },
            fail (error) {
              console.log('request fail', error);
              util.showModel('出错了',error.message);
            }
          })
        }else{

        }
      }
    });
  },

  refresh: function(){
    util.showBusy('加载中...');
    var that = this;

    qcloud.request({
      url: `${config.service.host}/weapp/getUserAssociationList`,
      login: true,
      success (result) {
        that.setData({
          joinedAssociationList: result.data.data
        });
        util.showSuccess('加载成功');
      },
      fail (error) {
        console.log('request fail', error.message);
      }
    });
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    util.showBusy('加载中...');
    var that = this;

    qcloud.request({
      url: `${config.service.host}/weapp/getUserAssociationList`,
      login: true,
      success (result) {
        that.setData({
          joinedAssociationList: result.data.data
        });
        util.showSuccess('加载成功');
      },
      fail (error) {
        console.log('request fail', error);
      }
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})