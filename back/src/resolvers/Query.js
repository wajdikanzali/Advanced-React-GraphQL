// const { forwardto } = require('prisma-binding');

const Query = {
   // items: forwardto('db'),
    async items(_, args, ctx, info) {
         const item = await ctx.db.query.items();
         return item;
     }
   };
   
module.exports = Query;
