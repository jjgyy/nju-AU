const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

  const category = ctx.query.category;

  const associationList = await mysql('association')
      .select('id','name')
      //.limit(size)//分页用的语句
      //.offset(Number(page)*size)
      .where('category', category);
  ctx.state.data = associationList;
};