'use strict';
const user = '/user/';
module.exports = app => {
  const { router, controller } = app;
  router.post(`${user}login`, controller.user.login);
  // router.post(`${user}login`, controller.user.login);
};

