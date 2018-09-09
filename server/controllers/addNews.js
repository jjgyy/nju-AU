
const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
    //const {bookid, comment, openid, location, phone} = ctx.request.body
    //console.log(bookid, comment, openid, location, phone)

  const  id = 'fb' + Date.parse(new Date()),
      title = ctx.query.title,
      author = ctx.query.author,
      author_from = ctx.query.author_from,
      article = ctx.query.article,
      furtherInfo = '没啥';


  try {
    await mysql('publicNews').insert({
      id: id,
      title: title,
      author: author,
      author_from: author_from,
      article: article,
      further_info: furtherInfo
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