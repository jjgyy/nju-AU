const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

  ctx.state.data = await mysql('article')
      .select('*')
      .where('delete', 0)
      .orderBy('id','desc');

};
