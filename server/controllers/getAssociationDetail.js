const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

  const id = ctx.query.id;

  const associationDetail = await mysql('association')
      .select('id','name','name_english','category','image_src','intro')
      .where('id',id)
      .first();
  ctx.state.data = associationDetail;

};
