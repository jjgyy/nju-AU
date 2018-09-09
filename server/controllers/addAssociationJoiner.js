const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  if (ctx.state.$wxInfo.loginState === 1) {
    // loginState 为 1，登录态校验成功
    const open_id = ctx.state.$wxInfo.userinfo.openId,
          association_id = ctx.query.association_id;

    try {
      await mysql('association_joiner').insert({
        open_id: open_id,
        association_id: association_id
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