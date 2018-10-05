const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

  const association_id = ctx.query.association_id;

  ctx.state.data = await mysql('article')
      .select('*')
      .where({
          association_id: association_id,
          delete: 0
      })
      .orderBy('id','desc');

};
