const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.loginState === 1) {

    const open_id = ctx.state.$wxInfo.userinfo.openId;

    try {
      const manageAssociationList = await mysql('association_manager')
          .join('association','association_manager.association_id','association.id')
          .select('association.*')
          .where('association_manager.open_id',open_id);
      ctx.state.data = manageAssociationList;
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