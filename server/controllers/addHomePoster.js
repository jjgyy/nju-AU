const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    if (ctx.state.$wxInfo.adminState === 1) {

        const activity_id = ctx.query.activity_id;

        try {
            await mysql('home_poster').insert({
                activity_id: activity_id
            });
        } catch (e) {
            ctx.state = {
                code: -1,
                data: {
                    msg: e.sqlMessage  //数据库报错信息
                }
            }
        }

    } else {
        ctx.state.code = -1
    }

};
