const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const association_id = ctx.query.association_id;

    ctx.body = await mysql('moment')
        .select('*')
        .where('association_id', association_id)
        .orderBy('moment_id','desc');

};
