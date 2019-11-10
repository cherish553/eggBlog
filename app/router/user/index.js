'use strict';
const user = '/user/';
module.exports = app => {
  const { router, controller } = app;
  router.post(`${user}login`, controller.user.login);
  router.get(`${user}getQiniuToken`, controller.user.getQiniuToken);
  router.delete(`${user}delQiniuFile/:name`, controller.user.delQiniuFile);
  router.get(`${user}getVisitsCount`, controller.user.getVisitsCount);
  router.get(`${user}getAddVistis`, controller.user.getAddVistis);
};

