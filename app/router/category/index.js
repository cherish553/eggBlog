'use strict';
const category = '/blog/category/';
module.exports = app => {
  const { router, controller } = app;
  // 获取类别列表
  router.post(`${category}list/:page/:size`, controller.category.list);
  // 添加文章类别
  router.post(`${category}add`, controller.category.add);
  // 编辑文章类别
  router.put(`${category}update`, controller.category.update);
  // 删除文章类别
  router.delete(`${category}del/:id`, controller.category.del);
  // 获取所有文章类别
  router.get(`${category}all`, controller.category.all);
};

