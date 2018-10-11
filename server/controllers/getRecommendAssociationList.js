const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    try {
        ctx.state.data = await mysql('association_joiner')
            .join('association','association_joiner.association_id','association.id')
            .select('association.*')
            .where('association_joiner.open_id', 'o4chG412hg0qJLpdXyTNOAW4G3mk');
    } catch (e) {
        ctx.state = {
            code: -1,
            data: {
                msg: e.sqlMessage
            }
        }
    }

};
