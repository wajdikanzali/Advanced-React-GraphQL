const Mutations = {
  async createItem(_, args, ctx, info) {
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    }, info);
    return item;
  },

  async updateItem(_, args, ctx, info) {
    const { id, ...rest } = args;
    const item = await ctx.db.mutation.updateItem({
      data: rest,
      where: { id },
    }, info);
    return item;
  },

  async deleteItem(_, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, info);
    return ctx.db.mutation.deleteItem({ where }, info);
  },
};

module.exports = Mutations;
