const {mysql} = require('../qcloud');

module.exports = async (ctx) => {
  if (ctx.state.$wxInfo.adminState === 1) {

    const open_id = ctx.query.open_id,
          association_id = ctx.query.association_id;

    try {
      await mysql('association_manager').insert({
        open_id: open_id,
        association_id: association_id,
        identity: 'chief'
      });
    } catch (e) {
      ctx.state = {
        code: -1,
        data: {
          msg: e.sqlMessage  //数据库报错信息
        }
      }
    }

  }
};
