const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    ctx.body = await mysql('activity')
        .select('activity_id', 'date', 'time', 'location', 'category', 'association_id', 'association_name', 'activity_name', 'image_src', 'ticket')
        .where('delete', 0)
        .orderBy('activity_id','desc');

};
