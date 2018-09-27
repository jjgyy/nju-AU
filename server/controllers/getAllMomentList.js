const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    ctx.body = await mysql('moment')
        .select('*')
        .where('delete', 0)
        .orderBy('moment_id','desc');

};
