var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    association_id: null,

    title: null,
    url: null,
    imgUrl: null
  },

  title: function(e){
    this.data.title = e.detail.value;
  },

  url: function(e){
    this.data.url = e.detail.value;
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
            res = JSON.parse(res.data)
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


  submit: function(){
    this.openConfirm()
  },
  openConfirm: function () {
    var that = this;

    wx.showModal({
      title: '确认提交',
      content: '提交文章',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          util.showBusy('正在提交...');
          qcloud.request({
            url: `${config.service.host}/weapp/addAssociationArticle`,
            data: {
              id: that.data.association_id,//社团id，只能叫id，中间键变量没写好
              title: that.data.title,
              url: that.data.url,
              image_src: that.data.imgUrl
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


  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
        association_id: options.id,
        categories: getApp().data.association_categories
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
