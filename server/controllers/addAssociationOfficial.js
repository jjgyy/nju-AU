const {mysql} = require('../qcloud')

module.exports = async (ctx) => {

  const id = ctx.query.id,
        official = ctx.query.official;

  ctx.state.data = ctx;

  try {
    await mysql('association_official').insert({
      id: id,
      official: official
    });
  } catch (e) {
    ctx.state = {
      code: -1,
      data: {
        msg: e.sqlMessage  //数据库报错信息
      }
    }
  }
}