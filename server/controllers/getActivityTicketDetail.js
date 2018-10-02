const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const activity_id = ctx.query.activity_id;

    ctx.body = await mysql('activity_ticket')
        .select('*')
        .where('activity_id', activity_id)
        .first();

};
