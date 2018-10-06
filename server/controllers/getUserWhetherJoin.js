const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const open_id = ctx.query.open_id,
          association_id = ctx.query.association_id;

    const res = await mysql('association_joiner').count('open_id as joined')
        .where({
            open_id: open_id,
            association_id: association_id
        });

    if (res[0].joined) {
        ctx.body = true;
    }

};
