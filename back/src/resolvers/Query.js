const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
   items: forwardTo('db'),
   item: forwardTo('db'),
   itemsConnection: forwardTo('db'),
   usersConnection: forwardTo('db'),
   me(parent, args, ctx, info) {
       if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },
  async users(_, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in');
    }
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONYPDATE']);
    return ctx.db.query.users({}, info);
  },
  async order(_, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in');
    }
    const order = await ctx.db.query.order({
      where: { id: args.id }
    }, info);
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
    if (!ownsOrder || !hasPermission) {
      throw new Error('You cant see this bud');
    }
    return order;
  }
};
   
module.exports = Query;
