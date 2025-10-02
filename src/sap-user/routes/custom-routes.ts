'use strict';

export default {
  routes: [
    {
      method: 'GET',
      path: '/sap-users/sync',
      handler: 'sync-user.syncUsers',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};

//http://localhost:1337/api/sap-users/sync