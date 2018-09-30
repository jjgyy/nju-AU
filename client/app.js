//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')

App({
    data:{
        userInfo: {},
        logged: false,
        needRefreshJoined: true,
        association_categories: ['公益', '体育', '艺术', '文化', '科技', '学术', '其他'],
        moment_categories: ['志愿时长', '体育打卡'],
        activity_categories: ['学术论坛', '文艺汇演']
    },
    onLaunch: function () {

        qcloud.setLoginUrl(config.service.loginUrl);

    }

});
