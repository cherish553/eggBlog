'use strict';

const Service = require('egg').Service;
class HomeService extends Service {
  // 添加文章分类名称
  async add(form) {
    return await this.app.mysql.insert('article', {
      ...form,
      creatTime: new Date(),
    });
  }
  // 根据id查询文章详情
  async search(id) {
    return (await this.app.mysql.select('article', { where: { id }, columns: [ 'id', 'name', 'title', 'inner', 'categoryId', 'tagId' ] }))[0];
  }
  // 查询文章列表
  async list({ name, page, size }) {
    return ({ total: (await this.app.mysql.query('SELECT COUNT(*) FROM article'))[0]['COUNT(*)'], data: await this.app.mysql.query(`SELECT * FROM article  WHERE name LIKE '%${name}%' LIMIT ${parseInt(size)} OFFSET ${--page * size}`) });
  }
  // 编辑文章
  async update(form) {
    await this.app.mysql.update('article', form);
    return true;
  }
  // 删除文章
  async del(id) {
    await this.app.mysql.delete('article', {
      id,
    });
    return true;
  }
}

module.exports = HomeService;

