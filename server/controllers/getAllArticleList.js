const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

  const page = ctx.query.page,
        size = 4;

  ctx.state.data = await mysql('article')
      .select('*')
      .where('delete', 0)
      .limit(size)
      .offset(Number(page) * size)
      .orderBy('id','desc');

};
