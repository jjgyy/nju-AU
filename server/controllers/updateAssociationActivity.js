const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    if (ctx.state.$wxInfo.managerState === 1) {

        const activity_id = ctx.query.activity_id,
            date = ctx.query.date,
            time = ctx.query.time,
            location = ctx.query.location,
            category = ctx.query.category,
            activity_name = ctx.query.activity_name,
            activity_intro = ctx.query.activity_intro,
            image_src = ctx.query.image_src,
            ticket = ctx.query.ticket,
            ticket_num = ctx.query.ticket_num,
            offline = ctx.query.offline;

        try {

            await mysql('activity')
                .where('activity_id', activity_id)
                .update({
                    date: date,
                    time: time,
                    location: location,
                    category: category,
                    activity_name: activity_name,
                    activity_intro: activity_intro,
                    image_src: image_src,
                    //ticket: ticket,
                    offline: offline,
                    thisKeyIsSkipped: undefined
                });


            if (parseInt(ticket) === 0) { return; }

            await mysql('activity_ticket')
                .where('activity_id', activity_id)
                .update({
                    total: ticket_num,
                    thisKeyIsSkipped: undefined
                });


        } catch (e) {
            ctx.state = {
                code: -1,
                data: {
                    msg: e.sqlMessage
                }
            }
        }

    } else {
        ctx.state.code = -1
    }
};
