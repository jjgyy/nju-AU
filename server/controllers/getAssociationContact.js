const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

  const id = ctx.query.id;

  var result = {};
  result.associationQQList = await mysql('association_qq')
      .select('id','qq')
      .where('id',id);
  result.associationOfficialList = await mysql('association_official')
      .select('id','official')
      .where('id',id);

  ctx.state.data = result;

};