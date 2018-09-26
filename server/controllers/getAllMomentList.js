const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    ctx.body = await mysql('moment')
        .select('*')
        .orderBy('moment_id','desc');

};
