const { forwardTo } = require('prisma-binding');

const Query = {
   items: forwardTo('db'),
   item: forwardTo('db'),
   itemsConnection: forwardTo('db'),
    // async items(_, args, ctx, info) {
    //      const item = await ctx.db.query.items();
    //      return item;
    //  }
   };
   
module.exports = Query;
