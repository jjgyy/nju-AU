const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

  const category = ctx.query.category;

    ctx.body = await mysql('association')
      .select('id','name','category','image_src')
      //.limit(size)//分页用的语句
      //.offset(Number(page)*size)
      .where('category', category);

};
