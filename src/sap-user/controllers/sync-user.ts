import { Context } from 'koa';

export default {
  async syncUsers(ctx: Context) {
    try {
      const result = await strapi.service('api::sap-user.sync-user').syncUsersFromExternalAPI();
      ctx.body = { message: result };
    } catch (err) {
      if (err instanceof Error) {
        ctx.badRequest('Đồng bộ thất bại', { error: err.message });
      } else {
        ctx.badRequest('Đồng bộ thất bại', { error: 'Unknown error' });
      }
    }
  },
};

