const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

  const associationList = await mysql('association')
      .select('id','name','name_english','category')
      //.limit(size)//分页用的语句
      //.offset(Number(page)*size)
      .orderBy('id','desc');
  ctx.state.data = associationList;
};
