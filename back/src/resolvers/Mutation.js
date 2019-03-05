const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { randomBytes } = require('crypto');
const { sendEmailSMTP } = require('../mail');
const { hasPermission } = require('../utils');

const Mutations = {
  async createItem(_, args, ctx, info) {
    if(!ctx.request.userId){
      throw new Error('You must logged in to do that!');
    }
    const item = await ctx.db.mutation.createItem({
      data: {
        user: {
          connect: {
            id: ctx.request.userId,
          }
        },
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
    const item = await ctx.db.query.item({ where }, `{ id, title }`);
    const ownsItem = item.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission));
    if(!ownsItem && !hasPermissions){
      throw new Error('You dont\'t have permission to do taht!');
    }
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions : { set: ['USER'] }
      }
    }, info);
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid Password!');
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    return user;
  },

  signout(_, args, ctx, info) {
    ctx.response.clearCookie('token');
    return {message: 'GoodBaye!'};
  },

  async requestReset(_, args, ctx, info){
    const user = await ctx.db.query.user({ where: { email: args.email }});
    if(!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;
    const res = await ctx.db.mutation.updateUser({
      where: { email: args. email },
      data: { resetToken, resetTokenExpiry },
    });
    await sendEmailSMTP(user.email, resetToken);
    console.info(`[smtp mailing] mail sent to ${user.email}`);
    return { message: 'Thanks!' };
  },

  async resetPassword(_, args, ctx, info) {
     if(args.password !== args.confirmPassword) {
       throw new Error('Your Password d\'ont match!');
     }
     const [user] = await ctx.db.query.users({
       where: {
         resetToken: args.resetToken,
         resetTokenExpiry_gte: Date.now() - 3600000,
       },
     });
     if(!user) {
       throw new Error('This token is either invalid or expired!');
     }
     const password = await bcrypt.hash(args.password, 10);
     const updateUser = await ctx.db.mutation.updateUser({
       where: { email: user.email },
       data: {
         password,
         resetToken: null,
         resetTokenExpiry: null,
       },
     });
     const token = jwt.sign({ userId: updateUser.id }, process.env.APP_SECRET);
     ctx.response.cookie('token', token, {
       httpOnly: true,
       maxAge: 1000 * 60 * 60 * 24 * 365,
     });
     return updateUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId,
        },
      },
      info
    );
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info
    );
  },

  async addToCart(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be signed in soooon');
    }
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
    });
    if (existingCartItem) {
      console.log('This item is already in their cart');
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 },
        },
        info
      );
    }
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId },
          },
          item: {
            connect: { id: args.id },
          },
        },
      },
      info
    );
  },
};

module.exports = Mutations;
