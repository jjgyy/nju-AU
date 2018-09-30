var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    association_id: null,

    articleList: null
  },

  toManageWriteArticlePage: function () {
    wx.navigateTo({
      url: '../manageWriteArticlePage/manageWriteArticlePage?' + 'id=' + this.data.association_id
    })
  },

  toArticleDetailPage: function (url) {
    wx.navigateTo({
      url: '../articleDetailPage/articleDetailPage?' + 'url=' + url
    })
  },

  open: function(e){
    var that = this,
        id = e.currentTarget.dataset.id,
        url = e.currentTarget.dataset.url;
    wx.showActionSheet({
      itemList: ['前往文章','删除'],
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0){
            that.toArticleDetailPage(url);
          } else {
            that.openDeleteConfirm(id);
          }
        }
      }
    });
  },
  openDeleteConfirm: function (id) {
    var that = this;
    wx.showModal({
      title: '确认删除',
      content: '将此文章删除',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          util.showBusy('正在删除...');
          qcloud.request({
            url: `${config.service.host}/weapp/deleteAssociationArticle`,
            data: {
              id: that.data.association_id,
              article_id: id
            },
            login: true,
            success () {
              that.refresh();
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

    wx.request({
      url: `${config.service.host}/weapp/getAssociationArticleList`,
      data: {
        association_id: that.data.association_id
      },
      success (res) {
        that.setData({
          articleList: res.data.data
        });
      },
      fail (error) {
        console.log('request fail', error);
        util.showModel('出错了', error.message);
      }
    });
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.setData({
      association_id: options.id
    });

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this;
    util.showBusy('加载中...');
    wx.request({
      url: `${config.service.host}/weapp/getAssociationArticleList`,
      data: {
        association_id: that.data.association_id
      },
      success (res) {
        that.setData({
          articleList: res.data.data
        });
      },
      fail (error) {
        console.log('request fail', error);
        util.showModel('出错了', error.message);
      }
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
