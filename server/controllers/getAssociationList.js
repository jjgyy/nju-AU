const {mysql} = require('../qcloud');

module.exports = async (ctx) => {
  //const {bookid, comment, openid, location, phone} = ctx.request.body
  //console.log(bookid, comment, openid, location, phone)
  const associationList = await mysql('association')
      .select('id','name','image_src')
      //.limit(size)//分页用的语句
      //.offset(Number(page)*size)
      .orderBy('id','desc');
  ctx.state.data = associationList;
};
