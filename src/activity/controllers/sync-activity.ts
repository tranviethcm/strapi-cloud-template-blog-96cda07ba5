import { Context } from 'koa';
//http://localhost:1337/api/activity/sync - Gọi API này để đồng bộ dữ liệu
export default {
  async syncActivities(ctx: Context) {
    try {
      const result = await strapi.service('api::activity.sync-activity').syncActivitiesFromExternalAPI();
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

