const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const association_id = ctx.query.association_id;

    ctx.body = await mysql('activity')
        .select('*')
        .where({
            association_id: association_id,
            delete: 0
        })
        .orderBy('activity_id','desc');

};
