var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');


Page({
    data:{
        association_id: null,
        associationDetail: {},
        associationQQList: [],
        associationOfficialList: [],
        momentList: null,
        articleList: null,
        activityList: null,

        joinerCondition: null,

        vid: '',

        showVideo: false,

        momentLikeDic: {},
        momentLikeList: null,

        hasJoined: false,

        joinBtnText: '+ 关注',

        needGetMoments: true,
        needGetArticles: true,
        needGetActivities: true,

        canLoadMoreMoments: true,
        momentsOffset: 0,

        canLoadMoreArticles: true,
        articlesOffset: 0,

        currentTab: 0,
        clientHeight: null,
        tabWordColor: ['#097aff', '#bbbbbb', '#bbbbbb', '#bbbbbb'],
        tabLineColor: ['#097aff', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']
    },

    toArticleDetailPage: function (e) {
        wx.navigateTo({
            url: '../articleDetailPage/articleDetailPage?' + 'url=' + e.currentTarget.dataset.url,
        });
        this.updateArticleRead(e.currentTarget.dataset.id);
        this.setData({
            ['articleReadList[' + e.currentTarget.dataset.index + '].read']: this.data.articleReadList[e.currentTarget.dataset.index].read + 1
        });
    },

    toAssociationQRcodePage: function (e) {
        wx.navigateTo({
            url: '../associationQRcodePage/associationQRcodePage?' + 'id=' + e.currentTarget.dataset.id
        })
    },

    toVideoPage: function () {
        var that = this;
        wx.navigateTo({
            url: '../videoPage/videoPage?' + 'vid=' + that.data.vid
        })
    },


    copy: function (e) {
        var copydata = e.currentTarget.dataset.copydata;
        wx.setClipboardData({
            data: copydata
        })
    },


    like: function (e) {
        if (this.data.momentLikeDic[e.currentTarget.dataset.id]) { return; }

        const that = this;

        //没赞过的点赞
        this.setData({
            ['momentLikeDic[' + e.currentTarget.dataset.id + ']']: true
        });

        this.setData({
            ['momentLikeList[' + e.currentTarget.dataset.index + '].like']: this.data.momentLikeList[e.currentTarget.dataset.index].like + 1
        });

        wx.setStorage({
            key: 'momentLikeDic',
            data: that.data.momentLikeDic
        });

        wx.request({
            url: `${config.service.host}/weapp/updateMomentLike`,
            data: {
                moment_id: e.currentTarget.dataset.id
            },
            success(result) {
            },
            fail(error) {
                console.log('request fail', error);
            }
        });

    },


    join: function () {
        this.openConfirm(this.data.association_id);
    },
    openConfirm: function (id) {
        var that = this;
        wx.showModal({
            title: '确认加入',
            content: '将此社团加入到我的社团',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        hasJoined: true,
                        joinBtnText: '已关注'
                    });

                    wx.request({
                        url: `${config.service.host}/weapp/addAssociationJoiner`,
                        data: {
                            association_id: id,
                            open_id: getApp().data.userInfo.openId
                        },
                        success () {
                            getApp().data.needRefreshJoined = true; // 有修改后将全局变量置为true
                        },
                        fail (error) {
                            console.log('request fail', error);
                            util.showModel('出错了', error.message);
                        }
                    });

                    wx.request({
                        url: `${config.service.host}/weapp/updateAssociationJoinerCondition`,
                        data: {
                            association_id: id,
                            gender: getApp().data.userInfo.gender
                        },
                        success (res) {
                            console.log(res);
                        },
                        fail (error) {
                            console.log('request fail', error);
                            util.showModel('出错了', error.message);
                        }
                    });

                    if (getApp().data.userInfo.gender == 1) {
                        that.setData({
                            ['joinerCondition.male']: (that.data.joinerCondition.male + 1)
                        })
                    } else {
                        that.setData({
                            ['joinerCondition.female']: (that.data.joinerCondition.female + 1)
                        })
                    }

                }
            }
        });
    },


    //切换tab

    clickIntroTab: function () {
        this.setData({
            currentTab: 0
        })
    },

    clickMomentTab: function () {
        this.setData({
            currentTab: 1
        });
        this.lazyGetMoments();
    },

    clickArticleTab: function () {
        this.setData({
            currentTab: 2
        });
        this.lazyGetArticles();
    },

    clickActivityTab: function () {
        this.setData({
            currentTab: 3
        });
        this.lazyGetActivities();
    },


    switchPage: function (e) {
        this.setData({
            currentTab: e.detail.current
        });

        switch (this.data.currentTab) {
            case 0:
                this.setData({
                    tabWordColor: ['#097aff', '#bbbbbb', '#bbbbbb', '#bbbbbb'],
                    tabLineColor: ['#097aff', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']
                });
                break;
            case 1:
                this.setData({
                    tabWordColor: ['#bbbbbb', '#097aff', '#bbbbbb', '#bbbbbb'],
                    tabLineColor: ['rgba(0,0,0,0)', '#097aff', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']
                });
                this.lazyGetMoments();
                break;
            case 2:
                this.setData({
                    tabWordColor: ['#bbbbbb', '#bbbbbb', '#097aff', '#bbbbbb'],
                    tabLineColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', '#097aff', 'rgba(0,0,0,0)']
                });
                this.lazyGetArticles();
                break;
            case 3:
                this.setData({
                    tabWordColor: ['#bbbbbb', '#bbbbbb', '#bbbbbb', '#097aff'],
                    tabLineColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', '#097aff']
                });
                this.lazyGetActivities();
                break;
        }

    },


    //懒加载

    lazyGetMoments: function () {
        if (!this.data.needGetMoments) { return; }
        var that = this;
        wx.request({
            url: `${config.service.host}/weapp/getAssociationMomentList`,
            data: {
                association_id: that.data.association_id
            },
            success(result) {
                var momentList = result.data;
                for (var i=0, len=momentList.length; i<len; i++) {
                    momentList[i].image_list = JSON.parse(momentList[i].image_list);
                    momentList[i].date = that.dateParser(momentList[i].date);
                }
                that.setData({
                    momentList: momentList,
                    needGetMoments: false,
                    momentsOffset: result.data[result.data.length-1].moment_id
                });
            },
            fail(error) {
                console.log('request fail', error);
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getAssociationMomentLikeList`,
            data: {
                association_id: that.data.association_id
            },
            success (res) {
                that.setData({
                    momentLikeList: res.data
                })
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });

        wx.getStorage({
            key: 'momentLikeDic',
            success: function (res) {
                that.setData({
                    momentLikeDic: res.data
                })
            }
        });
    },

    lazyGetArticles: function () {
        if (!this.data.needGetArticles) { return; }
        var that = this;
        wx.request({
            url: `${config.service.host}/weapp/getAssociationArticleList`,
            data: {
                association_id: that.data.association_id
            },
            success (res) {
                var articleList = res.data.data;
                for (var i=0, len=articleList.length; i<len; i++) {
                    articleList[i].date = that.dateParser(articleList[i].date);
                }
                that.setData({
                    articleList: articleList,
                    needGetArticles: false
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getAssociationArticleReadList`,
            data: {
                association_id: that.data.association_id
            },
            success (res) {

                that.setData({
                    articleReadList: res.data
                });

            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });

    },

    lazyGetActivities: function () {
        if (!this.data.needGetActivities) { return; }
        var that = this;
        wx.request({
            url: `${config.service.host}/weapp/getAssociationActivityList`,
            data: {
                association_id: that.data.association_id
            },
            success (res) {
                that.setData({
                    activityList: res.data
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });
    },


    //加载更多

    loadMoreMoments: function () {
        if (!this.data.canLoadMoreMoments) { return; }
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAssociationMomentList`,
            data: {
                association_id: that.data.association_id,
                offset: that.data.momentsOffset
            },
            success (result) {
                if (result.data.length === 0) {
                    that.setData( {canLoadMoreMoments: false} );
                    return;
                }

                var momentList = result.data;
                for (var i=0, len=momentList.length; i<len; i++) {
                    momentList[i].image_list = JSON.parse(momentList[i].image_list);
                    momentList[i].date = that.dateParser(momentList[i].date);
                }
                that.setData({
                    momentList: that.data.momentList.concat(momentList),
                    momentsOffset: result.data[result.data.length-1].moment_id
                });
            },
            fail (error) {
                console.log('request fail', error);
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getAssociationMomentLikeList`,
            data: {
                offset: that.data.momentsOffset,
                association_id: that.data.association_id
            },
            success (res) {
                that.setData({
                    momentLikeList: that.data.momentLikeList.concat(res.data)
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });

    },


    //加载更多

    loadMoreArticles: function () {
        if (!this.data.canLoadMoreArticles) { return; }
        var that = this;

        wx.request({
            url: `${config.service.host}/weapp/getAssociationArticleList`,
            data: {
                association_id: that.data.association_id,
                offset: that.data.articlesOffset
            },
            success (result) {
                if (result.data.length === 0) {
                    that.setData( {canLoadMoreArticles: false} );
                    return;
                }

                var articleList = result.data.data;
                for (var i=0, len=articleList.length; i<len; i++) {
                    articleList[i].date = that.dateParser(articleList[i].date);
                }
                that.setData({
                    articleList: that.data.articleList.concat(articleList),
                    articlesOffset: result.data[result.data.length-1].id
                });
            },
            fail (error) {
                console.log('request fail', error);
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getAssociationArticleReadList`,
            data: {
                offset: that.data.articlesOffset,
                association_id: that.data.association_id
            },
            success (res) {
                that.setData({
                    articleReadList: that.data.articleReadList.concat(res.data)
                });
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });

    },



    //更新文章阅读数
    updateArticleRead: function (article_id) {

        wx.request({
            url: `${config.service.host}/weapp/updateArticleRead`,
            data: {
                article_id: article_id
            },
            success (res) {
            },
            fail (error) {
                console.log('request fail', error);
                util.showModel('出错了', error.message);
            }
        });

    },



    onShareAppMessage: function () {
        return {
            title: this.data.associationDetail.association_name,
            desc: '在南京大学社团小程序中查看',
            path: 'pages/associationDetailPage/associationDetailPage?id=' + this.data.association_id
        }
    },

    onLoad:function(options){
        var that = this;

        this.setData({
            association_id: options.id
        });

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    clientHeight: res.windowHeight
                });
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getAssociationDetail`,
            data: {
                id: options.id
            },
            success: function(res) {
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
            success: function(res) {
                that.setData({
                    associationQQList: res.data.data.associationQQList,
                    associationOfficialList: res.data.data.associationOfficialList
                })
            }
        });

        wx.request({
            url: `${config.service.host}/weapp/getAssociationVideo`,
            data: {
                association_id: options.id
            },
            success: function(res) {
                res.data.vid !== undefined && that.setData( {vid: res.data.vid} )
            }
        });


        wx.request({
            url: `${config.service.host}/weapp/getAssociationJoinerCondition`,
            data: {
                association_id: that.data.association_id
            },
            success: function(res) {
                that.setData( {joinerCondition: res.data} );
            }
        });


        wx.request({
            url: `${config.service.host}/weapp/getUserWhetherJoin`,
            data: {
                open_id: getApp().data.userInfo.openId,
                association_id: that.data.association_id
            },
            success: function(res) {
                if (res.data === true) {
                    that.setData({
                        hasJoined: true,
                        joinBtnText: '已关注'
                    })
                }
            }
        });

    },



    dateParser: function (timestamp) {
        var interval = ( Date.parse(new Date()) - Date.parse(timestamp) ) / 1000;

        if (interval < 3600) {
            return '刚刚';
        }
        if ((interval/3600) < 24) {
            return parseInt(interval/3600) + '小时前';
        }
        if ((interval/86400) < 8) {
            return parseInt(interval/86400) + '天前';
        }
        return timestamp.substr(5, 5);
    }

});
