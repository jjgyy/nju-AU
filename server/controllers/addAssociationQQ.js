const {mysql} = require('../qcloud')

module.exports = async (ctx) => {

  const id = ctx.query.id,
        qq = ctx.query.qq;

  ctx.state.data = ctx;

  try {
    await mysql('association_qq').insert({
      id: id,
      qq: qq
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