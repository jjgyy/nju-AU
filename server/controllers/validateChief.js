const {mysql} = require('../qcloud');

module.exports = async (ctx, next) => {

    if (ctx.state.$wxInfo.loginState === 1) {

        const open_id = ctx.state.$wxInfo.userinfo.openId,
              id = ctx.query.id;

        const res = await mysql('association_manager')
            .count('open_id as isChief')
            .where({
                association_id: id,
                open_id: open_id,
                identity: 'chief'
            });

        if(res[0].isChief) {
            ctx.state.$wxInfo.chiefState = 1;
            await next();
        }

    } else {
        ctx.state.code = -1
    }

};

