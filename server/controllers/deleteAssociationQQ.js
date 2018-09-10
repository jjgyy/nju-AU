const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.managerState === 1) {

    const id = ctx.query.id,
          qq = ctx.query.qq;

    try {
      await mysql('association_qq')
          .where({id: id, qq: qq})
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