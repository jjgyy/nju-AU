const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    ctx.state.data = await mysql('association')
        .select('id','name','category');

};
