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
  // 编辑文章
  router.put(`${article}update`, controller.article.update);
  // 删除文章
  router.delete(`${article}del/:id`, controller.article.del);
  // 点赞文章
  router.get(`${article}star/:id`, controller.article.star);
  // 增加文章访问量
  router.get(`${article}visits/:id`, controller.article.visits);
  // 根据文章类型获取文章 0 是置顶文章 1是最新文章 2是热门文章
  router.get(`${article}filter/:type`, controller.article.filter);
  // 根据文章标题查询文章
  router.post(`${article}searchForName`, controller.article.searchForName);
  // 根据类别id查询文章
  router.post(`${article}searchForCategoryId`, controller.article.searchForCategoryId);
  // 根据标签id查询文章
  router.post(`${article}searchFortagId`, controller.article.searchFortagId);
};

