const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    ctx.state.data = await mysql('association_audit')
        .select('id', 'name', 'category')
        .orderBy('id','desc');

};
