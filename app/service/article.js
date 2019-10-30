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
    const article = await this.app.mysql.query(`SELECT a.*,b.name AS categoryName from article AS a INNER JOIN category AS b ON a.categoryId = b.id WHERE a.name LIKE '%${name}%' ORDER BY updateTime DESC LIMIT ${--page * size},${parseInt(size)} `);
    const tagName = await this.app.mysql.query('SELECT DISTINCT a.aid,b.NAME AS tagName FROM tagForArticle AS a INNER JOIN tag AS b ON a.tid = b.id');
    const data = article.map(items => ({ ...items, tagName: tagName.filter(item => item.aid === items.id) }));
    return ({ total: (await this.app.mysql.query('SELECT COUNT(*) FROM article'))[0]['COUNT(*)'], data });
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

