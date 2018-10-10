const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    if (ctx.state.$wxInfo.managerState !== 1) { return; }

    const association_id = ctx.query.id,
        title = ctx.query.title,
        url = ctx.query.url,
        image_src = ctx.query.image_src,
        open_id = ctx.state.$wxInfo.userinfo.openId;

    const association_name = await mysql('association')
        .select('name')
        .where('id',association_id)
        .first();

    const article_ids = await mysql('article').insert({
        association_id: association_id,
        title: title,
        association_name: association_name.name,
        url: url,
        image_src: image_src,
        open_id: open_id
    }).returning('article_id');

    await mysql('article_read').insert({
        article_id: article_ids[0],
    });

};
