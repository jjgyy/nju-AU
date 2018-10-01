const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const activity_id = ctx.query.activity_id;

    const activitys = await mysql('activity')
        .select('*')
        .where('activity_id', activity_id);

    const tickets = await mysql('activity_ticket')
        .select('*')
        .where('activity_id', activity_id);

    ctx.body = {
        activityDetail: activitys[0],
        ticketDetail: tickets[0]
    };

};
