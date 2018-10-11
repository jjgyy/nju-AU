//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');
var util = require('./utils/util.js');

App({
    data:{
        userInfo: {},
        logged: false,
        needRefreshJoined: true,
        association_categories: ['公益', '体育', '传统', '音乐', '舞蹈', '演艺', '文学', '美术', '科技', '学术', '语言', '文娱', '其他'],
        moment_categories: ['志愿时长', '体育打卡'],
        activity_categories: ['文艺汇演', '讲座报告', '体育赛事', '社会公益']
    },
    onLaunch: function () {

        qcloud.setLoginUrl(config.service.loginUrl);

    }

});
