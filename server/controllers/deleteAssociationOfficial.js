const {mysql} = require('../qcloud')

module.exports = async (ctx) => {

  if (ctx.state.$wxInfo.managerState === 1) {

    const id = ctx.query.id,
          official = ctx.query.official;

    try {
      await mysql('association_official')
          .where({id: id, official: official})
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

};
