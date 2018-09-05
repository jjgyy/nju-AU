const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
  //const {bookid, comment, openid, location, phone} = ctx.request.body
  //console.log(bookid, comment, openid, location, phone)

  const id = ctx.query.id,
        name = ctx.query.name,
        name_abbreviate = ctx.query.name_abbreviate,
        category = ctx.query.category,
        image_src = ctx.query.image_src;

  ctx.state.data = ctx;

  try {
    await mysql('association').insert({
      id: id,
      name: name,
      name_abbreviate: name_abbreviate,
      category: category,
      image_src: image_src
    });
  } catch (e) {
    ctx.state = {
      code: -1,
      data: {
        msg: e.sqlMessage  //数据库报错信息
      }
    }
  }
}