const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    const association_id = ctx.query.association_id,
          gender = ctx.query.gender;

    try {

        var res;

        if (gender == 1) {
            res = await mysql('association_joiner_condition')
                .select('male')
                .where('association_id', association_id);

            await mysql('association_joiner_condition')
                .where('association_id', association_id)
                .update({
                    male: (res[0].male + 1),
                    thisKeyIsSkipped: undefined
                });

        } else {
            res = await mysql('association_joiner_condition')
                .select('female')
                .where('association_id', association_id);

            await mysql('association_joiner_condition')
                .where('association_id', association_id)
                .update({
                    female: (res[0].female + 1),
                    thisKeyIsSkipped: undefined
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

};
