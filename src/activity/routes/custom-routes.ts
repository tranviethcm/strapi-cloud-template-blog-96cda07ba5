'use strict';

export default {
  routes: [
    {
      method: 'GET',
      path: '/activity/sync',
      handler: 'sync-activity.syncActivities',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};

//http://localhost:1337/api/activity/sync