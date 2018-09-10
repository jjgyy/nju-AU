const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.managerState === 1) {

    const id = ctx.query.id,
          intro = ctx.query.intro;

    try {
      await mysql('association')
          .where('id', id)
          .update({
            intro: intro,
            thisKeyIsSkipped: undefined
          });
    } catch (e) {
      ctx.state = {
        code: -1,
        data: {
          msg: e.sqlMessage
        }
      }
    }

  } else {
    ctx.state.code = -1
  }
}