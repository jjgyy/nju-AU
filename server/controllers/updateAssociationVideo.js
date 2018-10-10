const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    if (ctx.state.$wxInfo.managerState === 1) {

        const association_id = ctx.query.id,
              vid = ctx.query.vid;

        try {

            const res = await mysql('association_video')
                .count('association_id as hasVideo')
                .where({
                    association_id: association_id
                });

            if(!res[0].hasVideo) {

                await mysql('association_video').insert({
                    association_id: association_id,
                    vid: vid
                });

                return;
            }

            await mysql('association_video')
                .where('association_id', association_id)
                .update({
                    vid: vid,
                    thisKeyIsSkipped: undefined
                });

        } catch (e) {
            ctx.state = {
                code: -1,
                data: {
                    msg: e.sqlMessage
                }
            }
        }

    } else {
        ctx.state.code = -1
    }
};
