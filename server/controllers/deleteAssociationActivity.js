const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    if (ctx.state.$wxInfo.managerState === 1) {

        const activity_id = ctx.query.activity_id;

        try {

            await mysql('activity')
                .where('activity_id', activity_id)
                .update({
                    delete: 1,
                    thisKeyIsSkipped: undefined
                });

            await mysql('user_ticket')
                .where('activity_id', activity_id)
                .update({
                    delete: 1,
                    thisKeyIsSkipped: undefined
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
