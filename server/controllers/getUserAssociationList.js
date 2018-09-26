const {mysql} = require('../qcloud')

module.exports = async (ctx, next) => {

    const open_id = ctx.query.open_id;

    try {
        const joinedAssociationList = await mysql('association_joiner')
            .join('association','association_joiner.association_id','association.id')
            .select('association.id','association.name','association.category')
            .where('association_joiner.open_id',open_id);
        ctx.state.data = joinedAssociationList;
    } catch (e) {
        ctx.state = {
            code: -1,
            data: {
                msg: e.sqlMessage
            }
        }
    }

};
