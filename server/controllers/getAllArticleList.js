const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

  ctx.state.data = await mysql('article')
      .select('*')
      .orderBy('id','desc');

};