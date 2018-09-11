const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.adminState === 1) {

    const open_id = ctx.state.$wxInfo.userinfo.openId,
        password = ctx.query.password;

    var result = await mysql('admin')
        .select('password')
        .where('open_id', open_id)
        .first();

    if(result.password == password){
      ctx.state.data = 'pass';
    }

  } else {
    ctx.state.code = -1
  }
}