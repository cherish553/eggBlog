'use strict';

const Service = require('egg').Service;
class HomeService extends Service {
  // 获取所有标签
  async all() {
    return await this.app.mysql.select('tag');
  }
  // 添加标签分类名称
  async add({ name }) {
    return await this.app.mysql.insert('tag', { name });
  }
  // 查询是否之前已存在该分类名称
  async search({ name }) {
    if ((await this.app.mysql.select('tag', { where: { name } })).length) return false;
    return true;
  }
  // 查询标签分类列表
  async list({ name, page, size }) {
    return ({ total: (await this.app.mysql.query('SELECT COUNT(*) FROM tag'))[0]['COUNT(*)'], data: await this.app.mysql.query(`SELECT * FROM tag  WHERE name LIKE '%${name}%' LIMIT ${parseInt(size)} OFFSET ${--page * size}`) });
  }
  // 编辑标签类别
  async update({ name, id }) {
    const row = {
      id,
      name,
    };
    await this.app.mysql.update('tag', row);
    return true;
  }
  // 删除标签类别
  async del(id) {
    await this.app.mysql.delete('tag', {
      id,
    });
    return true;
  }
}

module.exports = HomeService;

