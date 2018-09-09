const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.loginState === 1) {

    const open_id = ctx.state.$wxInfo.userinfo.openId,
          association_id = ctx.query.association_id;

    try {
      await mysql('association_joiner')
          .where({open_id: open_id, association_id: association_id})
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