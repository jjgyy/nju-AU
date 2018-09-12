
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data:{
    categories: null,
    categoryIndex: 0,

    audit_id: null,

    open_id: null,
    name: null,
    name_english: null,
    intro: null,
    imgUrl: null
  },

  open_id: function(e){
    this.data.open_id = e.detail.value;
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
    this.openAddConfirm();
  },
  openAddConfirm: function () {
    var that = this;

    wx.showModal({
      title: '审核通过',
      content: '确认审核通过',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          util.showBusy('正在提交...');
          qcloud.request({
            url: `${config.service.host}/weapp/addAssociation`,
            data: {
              name: that.data.name,
              name_english: that.data.name_english,
              category: that.data.categories[that.data.categoryIndex],
              image_src: that.data.imgUrl,
              intro: that.data.intro
            },
            login: true,
            success () {
              qcloud.request({
                url: `${config.service.host}/weapp/addAssociationChief`,
                data: {
                  open_id: that.data.open_id,
                  association_id: result.data.data[0]
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
              });

            },
            fail (error) {
              console.log('request fail', error);
              util.showModel('出错了', error.message);
            }
          });

        }else{
        }
      }
    });
  },

  delete: function () {
    this.openDeleteConfirm();
  },
  openDeleteConfirm: function () {
    var that = this;

    wx.showModal({
      title: '删除申请',
      content: '确认删除此申请',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          util.showBusy('正在删除...');
          qcloud.request({
            url: `${config.service.host}/weapp/deleteAuditAssociation`,
            data: {
              id: that.data.audit_id,
            },
            login: true,
            success () {
              wx.navigateBack();
              util.showSuccess('删除成功');
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
    that.setData({
      categories: getApp().data.categories
    });
    qcloud.request({
      url: `${config.service.host}/weapp/getAuditAssociationDetail`,
      data: {
        id: options.id
      },
      login: true,
      success (result) {
        var categoryIndex = 0;
        for(var i=0, length=that.data.categories.length; i<length; i++){
          if(that.data.categories[i] == result.data.data.category){
            categoryIndex = i;
            break;
          }
        }
        that.setData({
          audit_id: result.data.data.id,
          open_id: result.data.data.open_id,
          name: result.data.data.name,
          name_english: result.data.data.name_english,
          categoryIndex: categoryIndex,
          intro: result.data.data.intro,
          imgUrl: result.data.data.image_src
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