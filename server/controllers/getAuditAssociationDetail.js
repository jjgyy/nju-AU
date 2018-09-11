const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.adminState === 1) {
    const id = ctx.query.id;

    ctx.state.data = await mysql('association_audit')
        .select('*')
        .where('id', id)
        .first();

  } else {
    ctx.state.code = -1
  }
}