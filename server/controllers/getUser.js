const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const open_id = ctx.query.open_id;

    try {
        ctx.body = await mysql('cSessionInfo')
            .select('open_id', 'user_info')
            .where('open_id', open_id);

    } catch (e) {
        ctx.state = {
            code: -1,
            data: {
                msg: e.sqlMessage
            }
        }
    }


};
