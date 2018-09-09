const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  if (ctx.state.$wxInfo.loginState === 1) {
    // loginState 为 1，登录态校验成功
    const open_id = ctx.state.$wxInfo.userinfo.openId;

    try {
      const joinedAssociationList = await mysql('association_joiner')
          .join('association','association_joiner.association_id','association.id')
          .select('association.*')
          .where('association_joiner.open_id',open_id);
      ctx.state.data = joinedAssociationList;
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