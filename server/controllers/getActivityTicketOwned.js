const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const activity_id = ctx.query.activity_id,
          open_id = ctx.query.open_id;

    const res = await mysql('user_ticket').count('open_id as owned')
        .where({
            open_id: open_id,
            activity_id: activity_id
        });

    if (res[0].owned) {
        ctx.body = true;
    }

};
