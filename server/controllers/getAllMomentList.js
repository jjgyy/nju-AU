const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const offset = (ctx.query.offset !== undefined) ? ctx.query.offset : 2<<16,
          size = 4;

    ctx.body = await mysql('moment')
        .select('*')
        .where('moment_id', '<', offset)
        .andWhere('delete', 0)
        .limit(size)
        .orderBy('moment_id','desc');

};
