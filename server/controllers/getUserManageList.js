const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {


    const open_id = ctx.query.open_id;

    try {
        ctx.state.data = await mysql('association_manager')
          .join('association','association_manager.association_id','association.id')
          .select('association.id','association.name','association.category')
          .where('association_manager.open_id',open_id);
    } catch (e) {
      ctx.state = {
        code: -1,
        data: {
          msg: e.sqlMessage
        }
      }
    }

};
