const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    if (ctx.state.$wxInfo.managerState === 1) {

        const moment_id = ctx.query.moment_id;

        try {
            await mysql('moment')
                .where('moment_id', moment_id)
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
