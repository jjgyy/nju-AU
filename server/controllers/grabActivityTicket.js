const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const open_id = ctx.query.open_id,
          activity_id = ctx.query.activity_id;

    var remain = 0,
        total = 0;

    const res = await mysql('user_ticket').count('open_id as owned')
        .where({
            open_id: open_id,
            activity_id: activity_id
        });

    if(res[0].owned) {
        ctx.body = {
            msg: 'owned'
        };
        return;
    }

    await mysql.transaction(function(trx) {
        mysql('activity_ticket')
            .transacting(trx)
            .forUpdate()
            .select('total', 'remain')
            .where({
                activity_id: activity_id
            })
            .then(function(resp) {

                remain = parseInt(resp[0].remain);
                if (remain <= 0) {
                    ctx.body = {
                        code: -1,
                        msg: '已无余票'
                    };
                    return;
                }
                total = parseInt(resp[0].total);
                remain = remain - 1;

            })
            .then(function () {

                mysql('activity_ticket')
                    .transacting(trx)
                    .where({
                        activity_id: activity_id
                    })
                    .update({
                        remain: remain,
                        thisKeyIsSkipped: undefined
                    })
                    .then(trx.commit)
                    .catch(trx.rollback);

            })
            .then(function () {
                ctx.body = {
                    msg: 'success'
                }
            })

    });


    await mysql('user_ticket').insert({
        open_id: open_id,
        activity_id: activity_id,
        ticket_no: (total - remain)
    });


};
