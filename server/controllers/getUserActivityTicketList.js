const {mysql} = require('../qcloud')

module.exports = async (ctx) => {

    const open_id = ctx.query.open_id;

    try {
        ctx.body = await mysql('activity')
            .join('user_ticket','activity.activity_id','user_ticket.activity_id')
            .select('activity.activity_id', 'activity.date', 'activity.time', 'activity.location', 'activity.category', 'activity.association_id', 'activity.association_name', 'activity.activity_name', 'activity.image_src', 'user_ticket.ticket_no')
            .where('user_ticket.open_id', open_id);
    } catch (e) {
        ctx.state = {
            code: -1,
            data: {
                msg: e.sqlMessage
            }
        }
    }

};
