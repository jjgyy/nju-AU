const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.managerState === 1) {

    const article_id = ctx.query.article_id;

    try {
      await mysql('article')
          .where('id', article_id)
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