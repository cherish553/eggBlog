'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  // async index() {
  //   const { ctx, service } = this;
  //   ctx.body = await service.home.index();
  // }
  async login() {
    const { ctx, service } = this;
    const login = [
      { code: 0, message: '登录成功', data: await service.user.login() },
      { code: 1, message: '账号或密码错误' },
    ];
    if (ctx.request.body.passWord !== await service.user.checkPass(ctx.request.body.userName)) return (ctx.body = login[1]);
    ctx.body = login[0];
  }
  async getQiniuToken() {
    const { ctx } = this;
    ctx.body = { code: 0, data: await (ctx.helper.index.getToken()), message: '' };
  }
  async delQiniuFile() {
    const { ctx } = this;
    const { name } = ctx.params;
    ctx.body = { code: 0, data: await ctx.helper.del.delFile(name), message: '' };
  }
  async getVisitsCount() {
    const { ctx, service } = this;
    ctx.body = { code: 0, data: (await service.user.getVisitsCount())[0], message: '' };
  }
  async getAddVistis() {
    const { ctx, service } = this;
    ctx.body = { code: 0, data: (await service.user.getAddVistis()), message: '' };
  }
  // console.log(ctx.request.body);
  // ctx.body = ({ message: 'ok' });
  // ctx.body = { code: 0, message: 'success', data: await service.user.login() };
}
// }

module.exports = HomeController;
