const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const association_id = ctx.query.association_id;

    ctx.body = await mysql('association_manager')
        .join('cSessionInfo','association_manager.open_id','cSessionInfo.open_id')
        .select('cSessionInfo.open_id','cSessionInfo.user_info','association_manager.identity')
        .where('association_manager.association_id', association_id);

};
