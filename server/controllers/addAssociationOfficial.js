const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.managerState === 1) {
    const id = ctx.query.id,
          official = ctx.query.official;

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

  } else {
    ctx.state.code = -1
  }

}