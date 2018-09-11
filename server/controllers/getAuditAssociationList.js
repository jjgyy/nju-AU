const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.adminState === 1) {

    ctx.state.data = await mysql('association_audit')
        .select('id', 'name', 'category')
        .orderBy('id','desc');

  } else {
    ctx.state.code = -1
  }
}