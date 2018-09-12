
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    categories: null,
    categoryIndex: 0,

    name: null,
    name_english: null,
    intro: null,
    imgUrl: null
  },

  name: function(e){
    this.data.name = e.detail.value;
  },

  name_english: function(e){
    this.data.name_english = e.detail.value;
  },

  intro: function(e){
    this.data.intro = e.detail.value;
  },

  submit: function(){
    this.openConfirm()
  },
  openConfirm: function () {
    var that = this;

    wx.showModal({
      title: '确认提交',
      content: '提交入驻社团申请',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          util.showBusy('正在提交...');
          qcloud.request({
            url: `${config.service.host}/weapp/addAuditAssociation`,
            data: {
              name: that.data.name,
              name_english: that.data.name_english,
              category: that.data.categories[that.data.categoryIndex],
              image_src: that.data.imgUrl,
              intro: that.data.intro
            },
            login: true,
            success () {
              wx.navigateBack();
              util.showSuccess('成功，等待审核');
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

  bindCategoryChange: function(e) {
    this.setData({
      categoryIndex: e.detail.value
    })
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
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function(res){
            util.showSuccess('上传图片成功')
            console.log(res)
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              imgUrl: res.data.imgUrl
            })
          },

          fail: function(e) {
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

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      categories: getApp().data.categories
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