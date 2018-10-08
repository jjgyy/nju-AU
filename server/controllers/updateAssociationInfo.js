const {mysql} = require('../qcloud');

module.exports = async (ctx) => {

    if (ctx.state.$wxInfo.managerState === 1) {

        const id = ctx.query.id,
            name = ctx.query.name,
            name_english = ctx.query.name_english,
            category = ctx.query.category,
            intro = ctx.query.intro,
            image_src = ctx.query.image_src;

        try {

            await mysql('association')
                .where('id', id)
                .update({
                    name: name,
                    name_english: name_english,
                    category: category,
                    intro: intro,
                    image_src: image_src,
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
