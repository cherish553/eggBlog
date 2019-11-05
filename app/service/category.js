'use strict';

const Service = require('egg').Service;
class HomeService extends Service {
  // 获取所有类别
  async all() {
    return await this.app.mysql.select('category');
  }
  // 添加文章分类名称
  async add({ name }) {
    return await this.app.mysql.insert('category', { name });
  }
  // 查询是否之前已存在该分类名称
  async search({ name }) {
    if ((await this.app.mysql.select('category', { where: { name } })).length) return false;
    return true;
  }
  // 查询文章分类列表
  async list({ name, page, size }) {
    const data = await this.app.mysql.query(`SELECT * FROM category  WHERE name LIKE '%${name}%' LIMIT ${parseInt(size)} OFFSET ${--page * size}`);
    const total = (await this.app.mysql.query(`SELECT COUNT(*) FROM category  WHERE name LIKE '%${name}%'`))[0]['COUNT(*)'];
    return ({ total, data });
  }
  // 编辑文章类别
  async update({ name, id }) {
    const row = {
      id,
      name,
    };
    await this.app.mysql.update('category', row);
    return true;
  }
  // 删除文章类别
  async del(id) {
    await this.app.mysql.delete('category', {
      id,
    });
    return true;
  }
}

module.exports = HomeService;

