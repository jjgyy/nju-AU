const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.adminState === 1) {
    const id = ctx.query.id;

    try {

      ctx.state.data = await mysql('association_audit')
          .where('id', id)
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
}