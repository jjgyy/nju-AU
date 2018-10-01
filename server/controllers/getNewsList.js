const {mysql} = require('../qcloud');

module.exports = async (ctx) => {
    //const {bookid, comment, openid, location, phone} = ctx.request.body
    //console.log(bookid, comment, openid, location, phone)
    ctx.state.data = await mysql('publicNews')
        .select('publicNews.*')
        //.limit(size)//分页用的语句
        //.offset(Number(page)*size)
        .orderBy('publicNews.date','desc');

};

