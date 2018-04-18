module.exports = app => {
    return class SPAController extends app.Controller {
        async ssr () {
            const { ctx } = this;
            await ctx.render('ssr.js', {url: ctx.url});
        }
    };
};
