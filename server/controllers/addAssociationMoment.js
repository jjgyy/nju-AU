const {mysql} = require('../qcloud');

module.exports = async (ctx) => {
    if (ctx.state.$wxInfo.managerState === 1) {

        const association_id = ctx.query.id,
              category = ctx.query.category,
              content = ctx.query.content,
              image_list = ctx.query.image_list

        const res = await mysql('association')
            .select('name', 'image_src')
            .where('id',association_id)
            .first();

        try {
            await mysql('moment').insert({
                association_id: association_id,
                association_name: res.name,
                category: category,
                content: content,
                image_list: image_list
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
}
