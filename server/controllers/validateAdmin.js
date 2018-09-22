const {mysql} = require('../qcloud');

module.exports = async (ctx, next) => {

    if (ctx.state.$wxInfo.loginState === 1) {

        const open_id = ctx.state.$wxInfo.userinfo.openId;

        const res = await mysql('admin')
            .count('open_id as isAdmin')
            .where({
                open_id: open_id
            });

        if(res[0].isAdmin) {
            ctx.state.$wxInfo.adminState = 1;
            await next();
        }

    } else {
        ctx.state.code = -1
    }

};
