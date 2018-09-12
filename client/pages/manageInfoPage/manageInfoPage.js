var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    association_id: null,

    categories: null,
    categoryIndex: 0,

    name: null,
    name_english: null,
    intro: null,
    imgUrl: null
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
      title: '确认修改',
      content: '修改社团基本信息',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          util.showBusy('正在提交...');
          qcloud.request({
            url: `${config.service.host}/weapp/updateAssociationInfo`,
            data: {
              id: that.data.association_id,
              name: that.data.name,
              name_english: that.data.name_english,
              category: that.data.categories[that.data.categoryIndex],
              intro: that.data.intro,
              image_src: that.data.imgUrl
            },
            login: true,
            success () {
              wx.navigateBack();
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

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    util.showBusy('加载中...');
    var that = this;
    this.setData({
      association_id: options.id,
      categories: getApp().data.categories
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
        var categoryIndex = 0;
        for(var i=0, length=that.data.categories.length; i<length; i++){
          if(that.data.categories[i] == res.data.data.category){
            categoryIndex = i;
            break;
          }
        }
        that.setData({
          name: res.data.data.name,
          name_english: res.data.data.name_english,
          categoryIndex: categoryIndex,
          intro: res.data.data.intro,
          imgUrl: res.data.data.image_src
        });
        util.showSuccess('加载成功');
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