'use strict';
const tag = '/tag/';
module.exports = app => {
  const { router, controller } = app;
  // 获取标签列表
  router.post(`${tag}list/:page/:size`, controller.tag.list);
  // 添加文章标签
  router.post(`${tag}add`, controller.tag.add);
  // 编辑文章标签
  router.put(`${tag}update`, controller.tag.update);
  // 删除文章标签
  router.delete(`${tag}del/:id`, controller.tag.del);
  // 获取所有文章标签
  router.get(`${tag}all`, controller.tag.all);
};

