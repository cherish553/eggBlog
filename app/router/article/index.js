'use strict';
const article = '/article/';
module.exports = app => {
  const { router, controller } = app;
  // 获取文章列表
  router.post(`${article}list/:page/:size`, controller.article.list);
  // 添加文章
  router.post(`${article}add`, controller.article.add);
  // 查询文章详情
  router.get(`${article}search/:id`, controller.article.search);
  // // 编辑文章
  router.put(`${article}update`, controller.article.update);
  // 删除文章
  router.delete(`${article}del/:id`, controller.article.del);
};

