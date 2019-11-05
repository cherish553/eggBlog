'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  async all() {
    const { ctx, service } = this;
    const data = await service.category.all();
    if (!Object.keys(data).length) return (ctx.body = { code: 1, data, message: '暂无数据' });
    ctx.body = { code: 0, data, message: '' };
  }
  // 获取文章类别
  async list() {
    const { ctx, service } = this;
    const { page, size } = ctx.params;
    const form = { page, size, name: ctx.request.body.name };
    const data = await service.category.list(form);
    if (!Object.keys(data).length) return (ctx.body = { code: 1, data, message: '暂无数据' });
    ctx.body = { code: 0, data, message: '' };
  }
  // 添加文章类别
  async add() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    if (!await service.category.search(body)) return (ctx.body = { code: 1, data: false, message: '该类别已存在' });
    await service.category.add(body);
    ctx.body = { code: 0, data: true, message: '添加成功' };
  }
  // 编辑文章类别
  async update() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    if (await service.category.update(body)) return (ctx.body = { code: 0, data: true, message: '编辑文章类别成功' });
  }
  // 删除文章类别
  async del() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (await service.category.del(id)) return (ctx.body = { code: 0, data: true, message: '删除文章类别成功' });
  }
}

module.exports = HomeController;
