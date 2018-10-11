const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    if (ctx.state.$wxInfo.managerState === 1) {

        const article_id = ctx.query.article_id;

        try {
            await mysql('article')
                .where('id', article_id)
                .update({
                    delete: 1,
                    thisKeyIsSkipped: undefined
                });

            await mysql('article_read')
                .where('article_id', article_id)
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
