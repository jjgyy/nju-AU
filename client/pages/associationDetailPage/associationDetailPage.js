var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    association_id: null,
    associationDetail: {},
    associationQQList: [],
    associationOfficialList: [],

    hasJoined: false,

    currentTab: 0,
    clientHeight: null,
    leftTabColor: '#0f0f0f',
    rightTabColor: '#cccccc',
    leftTabLineColor: '#0f0f0f',
    rightTabLineColor: 'rgba(0,0,0,0)'
  },

  copy: function (e) {
    var copydata = e.currentTarget.dataset.copydata;
    wx.setClipboardData({
      data: copydata,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data)
          }
        })
      }
    })
  },

  join: function () {
    this.setData({
      hasJoined: true
    });
    qcloud.request({
      url: `${config.service.host}/weapp/addAssociationJoiner`,
      data: {
        association_id: this.data.association_id
      },
      login: true,
      success (result) {
        console.log('request success', result)
      },
      fail (error) {
        console.log('request fail', error);
      }
    })
  },

  clickLeftTab: function () {
    this.setData({
      currentTab: 0
    })
  },

  clickRightTab: function () {
    this.setData({
      currentTab: 1
    })
  },

  switchPage: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.refreshTab();
  },


  refreshTab: function () {
    if (this.data.currentTab == 0){
      this.setData({
        leftTabColor: '#0f0f0f',
        rightTabColor: '#cccccc',
        leftTabLineColor: '#0f0f0f',
        rightTabLineColor: 'rgba(0,0,0,0)'
      });
    }
    else{
      this.setData({
        leftTabColor: '#cccccc',
        rightTabColor: '#0f0f0f',
        leftTabLineColor: 'rgba(0,0,0,0)',
        rightTabLineColor: '#0f0f0f'
      });
    }
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    this.setData({
      association_id: options.id
    });

    if(options.hasJoined == 'true'){
      this.setData({
        hasJoined: true
      })
    }
    else{
      this.setData({
        hasJoined: false
      })
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight * 0.65
        });
      }
    });

    wx.request({
      url: `${config.service.host}/weapp/getAssociationDetail`,
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data);
        that.setData({
          associationDetail: res.data.data
        })
      }
    });

    wx.request({
      url: `${config.service.host}/weapp/getAssociationContact`,
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data);
        that.setData({
          associationQQList: res.data.data.associationQQList,
          associationOfficialList: res.data.data.associationOfficialList
        })
      }
    })

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