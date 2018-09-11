const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.loginState === 1) {

    const open_id = ctx.state.$wxInfo.userinfo.openId;

    const adminList = await mysql('admin')
        .select('open_id');
    var isAdmin = false;
    for(var i=0, length=adminList.length; i<length; i++){
      if(adminList[i].open_id == open_id){
        isAdmin = true;
        break;
      }
    }
    if(isAdmin) {
      ctx.state.$wxInfo.adminState = 1;
      await next();
    }

  } else {
    ctx.state.code = -1
  }

}