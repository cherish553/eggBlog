'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  // 获取文章
  async list() {
    const { ctx, service } = this;
    const { page, size } = ctx.params;
    const form = { page, size, ...ctx.request.body };
    const data = await service.article.list(form);
    if (!Object.keys(data).length) return (ctx.body = { code: 1, data, message: '暂无数据' });
    ctx.body = { code: 0, data, message: '获取成功' };
  }
  // 添加文章
  async add() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    await service.article.add(body);
    ctx.body = { code: 0, data: true, message: '添加成功' };
  }
  // 根据id查询文章详情
  async search() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    const data = await service.article.search(id);
    ctx.body = { code: 0, data, message: '查询成功' };
  }
  // 编辑文章
  async update() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    if (await service.article.update(body)) return (ctx.body = { code: 0, data: true, message: '编辑文章成功' });
  }
  // 删除文章
  async del() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (await service.article.del(id)) return (ctx.body = { code: 0, data: true, message: '删除文章成功' });
  }
}

module.exports = HomeController;
