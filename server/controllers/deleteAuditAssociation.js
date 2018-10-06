const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

  if (ctx.state.$wxInfo.adminState === 1) {
    const id = ctx.query.id;

    try {

      await mysql('association_audit')
          .where('id', id)
          .del();

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
};
