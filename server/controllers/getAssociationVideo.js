const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const association_id = ctx.query.association_id;

    ctx.body = await mysql('association_video')
        .select('vid')
        .where({
            'association_id': association_id
        })
        .first();

};
