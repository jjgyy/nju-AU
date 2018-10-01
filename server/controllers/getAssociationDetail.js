const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const id = ctx.query.id;

    ctx.state.data = await mysql('association')
        .select('id','name','name_english','category','image_src','intro')
        .where('id',id)
        .first();

};
