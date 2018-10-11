const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const offset = (ctx.query.offset !== undefined) ? ctx.query.offset : 2<<16,
          size = 4;

    ctx.body = await mysql('article_read')
        .select('read')
        .where('article_id', '<', offset)
        .andWhere('delete', 0)
        .limit(size)
        .orderBy('article_id','desc');

};
