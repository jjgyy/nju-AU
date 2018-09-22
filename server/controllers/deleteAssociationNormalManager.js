const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    if (ctx.state.$wxInfo.managerState === 1 || ctx.state.$wxInfo.adminState === 1) {

        const association_id = ctx.query.id,
              open_id = ctx.query.open_id;

        try {
            await mysql('association_manager')
                .where({open_id: open_id, association_id: association_id})
                .del();
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
