const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const offset = (ctx.query.offset !== undefined) ? ctx.query.offset : 2<<16,
          size = 4;

    ctx.body = await mysql('activity')
        .select('activity_id', 'date', 'time', 'location', 'category', 'association_id', 'association_name', 'activity_name', 'image_src', 'ticket')
        .where('activity_id', '<', offset)
        .andWhere('delete', 0)
        .limit(size)
        .orderBy('activity_id','desc');

};
