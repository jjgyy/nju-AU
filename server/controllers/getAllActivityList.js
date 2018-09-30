const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    ctx.body = await mysql('activity')
        .select('*')
        .where('delete', 0)
        .orderBy('activity_id','desc');

};
