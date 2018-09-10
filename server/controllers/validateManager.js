const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.loginState === 1) {
    const open_id = ctx.state.$wxInfo.userinfo.openId,
          id = ctx.query.id;
    const managerList = await mysql('association_manager')
        .select('open_id')
        .where('association_id',id);
    var isManager = false;
    for(var i=0, length=managerList.length; i<length; i++){
      if(managerList[i].open_id == open_id){
        isManager = true;
        break;
      }
    }
    if(isManager) {
      ctx.state.$wxInfo.managerState = 1;
    }

    await next();

  } else {
    ctx.state.code = -1
  }

}