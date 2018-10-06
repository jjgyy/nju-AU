const {mysql} = require('../qcloud')

module.exports = async (ctx) => {

    try {
        ctx.body = await mysql('activity')
            .join('home_poster', 'activity.activity_id', 'home_poster.activity_id')
            .select('activity.activity_id', 'activity.date', 'activity.time', 'activity.location', 'activity.category', 'activity.association_id', 'activity.association_name', 'activity.activity_name', 'activity.image_src');
    } catch (e) {
        ctx.state = {
            code: -1,
            data: {
                msg: e.sqlMessage
            }
        }
    }

};
