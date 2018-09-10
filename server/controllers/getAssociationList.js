const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

  const associationList = await mysql('association')
      .select('id','name','category');
      //.limit(size)//分页用的语句
      //.offset(Number(page)*size)
  ctx.state.data = associationList;
};
