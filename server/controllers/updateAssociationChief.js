const {mysql} = require('../qcloud');

module.exports = async (ctx, next) => {

    if (ctx.state.$wxInfo.chiefState === 1 || ctx.state.$wxInfo.adminState === 1) {

        const id = ctx.query.id,
              open_id = ctx.query.open_id;

        try {
            const existChief = await mysql('association_manager')
                .count('open_id as existChief')
                .where({
                    association_id: id,
                    identity: 'chief'
                });

            const hasBeenNormal = await mysql('association_manager')
                .count('open_id as hasBeenNormal')
                .where({
                    association_id: id,
                    open_id: open_id
                });

            //存在了主席的话，先降级为普通管理
            if (existChief[0].existChief) {
                await mysql('association_manager')
                    .where({
                        association_id: id,
                        identity: 'chief',
                    })
                    .update({
                        identity: 'normal',
                        thisKeyIsSkipped: undefined
                    });
            }

            //新主席是普通管理则更新，不是则插入
            if (hasBeenNormal[0].hasBeenNormal) {
                await mysql('association_manager')
                    .where({
                        association_id: id,
                        open_id: open_id,
                    })
                    .update({
                        identity: 'chief',
                        thisKeyIsSkipped: undefined
                    });
            } else {
                await mysql('association_manager')
                    .insert({
                        open_id: open_id,
                        association_id: id,
                        identity: 'chief'
                    });
            }


        } catch (e) {
            ctx.state = {
                code: -1,
                data: {
                    msg: e.sqlMessage  //数据库报错信息
                }
            }
        }

    } else {
        ctx.state.code = -1
    }

};
