const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const article_id = ctx.query.article_id;

    try {
        var res = await mysql('article_read')
            .select('read')
            .where('article_id', article_id);

        await mysql('article_read')
            .where('article_id', article_id)
            .update({
                read: (res[0].read + 1),
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

};
