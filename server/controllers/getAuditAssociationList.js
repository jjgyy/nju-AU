const {mysql} = require('../qcloud');

module.exports = async (ctx, next) => {

    ctx.state.data = await mysql('association_audit')
        .select('id', 'name', 'category')
        .orderBy('id','desc');

};
