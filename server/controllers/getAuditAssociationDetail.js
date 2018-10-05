const {mysql} = require('../qcloud');

module.exports = async (ctx, next) => {

    const id = ctx.query.id;

    ctx.state.data = await mysql('association_audit')
        .select('*')
        .where('id', id)
        .first();

};
