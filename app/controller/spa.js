module.exports = app => {
    return class SPAController extends app.Controller {
        async ssr () {
            const { ctx } = this;
            // await ctx.renderClient('ssr.js', {url: ctx.url});
            await ctx.render('ssr.js', {url: ctx.url});
        }
    };
};
