const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

  if (ctx.state.$wxInfo.loginState === 1) {

    const open_id = ctx.state.$wxInfo.userinfo.openId,
          password = ctx.query.password;

    try {


      var result = await mysql('admin')
          .select('password')
          .where('open_id', open_id)
          .first();

      if(result.password == password){
        ctx.state.data = "pass";
      }else{
        ctx.state.data = "stop";
      }

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