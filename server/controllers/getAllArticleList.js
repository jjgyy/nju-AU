const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const offset = (ctx.query.offset !== undefined) ? ctx.query.offset : 2<<16,
          size = 4;

    ctx.state.data = await mysql('article')
        .select('*')
        .where('id', '<', offset)
        .andWhere('delete', 0)
        .limit(size)
        .orderBy('id','desc');

};
