const {mysql} = require('../qcloud');

module.exports = async (ctx) => {
    if (ctx.state.$wxInfo.managerState === 1) {

        const association_id = ctx.query.id,
              date = ctx.query.date,
              time = ctx.query.time,
              category = ctx.query.category,
              activity_name = ctx.query.activity_name,
              activity_intro = ctx.query.activity_intro,
              image_src = ctx.query.image_src,
              ticket = ctx.query.ticket;

        const association_name = await mysql('association')
            .select('name')
            .where('id',association_id)
            .first();

        try {
            await mysql('activity').insert({
                date: date,
                time: time,
                category: category,
                association_id: association_id,
                association_name: association_name.name,
                activity_name: activity_name,
                activity_intro: activity_intro,
                image_src: image_src,
                ticket: ticket
            });
        } catch (e) {
            ctx.state = {
                code: -1,
                data: {
                    msg: e.sqlMessage  //数据库报错信息
                }
            }
        }

    }
};
