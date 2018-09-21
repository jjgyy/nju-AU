const {mysql} = require('../qcloud')

module.exports = async (ctx) => {

    const nick_name = ctx.query.nick_name;

    try {
        const userList = await mysql('cSessionInfo')
            .select('open_id','user_info')
            .where('user_info', 'like', '%'+nick_name+'%')
            .limit(5);
        ctx.body = userList;
    } catch (e) {
        ctx.state = {
            code: -1,
            data: {
                msg: e.sqlMessage
            }
        }
    }


};
