const {mysql} = require('../qcloud')

module.exports = async (ctx) => {

    const open_id = ctx.query.open_id,
          name = ctx.query.name,
          name_english = ctx.query.name_english,
          category = ctx.query.category,
          image_src = ctx.query.image_src,
          intro = ctx.query.intro;


    try {
      await mysql('association_audit').insert({
        open_id: open_id,
        name: name,
        name_english: name_english,
        category: category,
        image_src: image_src,
        intro: intro
      });
    } catch (e) {
      ctx.state = {
        code: -1,
        data: {
          msg: e.sqlMessage  //数据库报错信息
        }
      }
    }

};
