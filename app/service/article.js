'use strict';

const Service = require('egg').Service;
class HomeService extends Service {
  // 添加文章分类名称
  async add(form) {
    let { tagId, ...rest } = form;
    tagId = tagId.split(',');
    const { insertId } = await this.app.mysql.insert('article', {
      ...rest,
      creatTime: new Date(),
    });
    let data = tagId.map(item => (`(${item},${insertId})`)).join(',');
    data = data.replace(/[:]/g, ',');
    return (await this.app.mysql.query(`INSERT INTO tagForArticle(tid,aid)  VALUES ${data}`));
  }
  // 根据id查询文章详情
  async search(id) {
    const data = (await this.app.mysql.select('article', { where: { id }, columns: [ 'id', 'name', 'title', 'inner', 'categoryId' ] }))[0];
    const { id: aid } = data;
    const tagName = await this.app.mysql.query(`SELECT DISTINCT a.aid,a.tid AS tagId,b.NAME AS tagName FROM tagForArticle AS a INNER JOIN tag AS b ON a.tid = b.id WHERE aid=${aid}`);
    return ([ data ].map(items => ({ ...items, tagName: tagName.filter(item => item.aid === items.id) })))[0];
  }
  // 查询文章列表
  async list({ name, page, size, title, categoryId, tagId }) {
    // 查询对应的tag
    let tid = '';
    if (tagId) {
      tid = 'WHERE' + tagId.split(',').reduce((pre, now) => {
        pre += ` OR tid = ${now}`;
        return pre;
      }, '').replace(/[O][R]{1}/, '');
    }
    const tagName = await this.app.mysql.query(`SELECT DISTINCT a.aid,a.tid,b.NAME AS tagName FROM tagForArticle AS a INNER JOIN tag AS b ON a.tid = b.id  ${tid}`);
    const obj = {};
    const total = tagName.filter(item => {
      if (obj[item.aid]) return false;
      obj[item.aid] = true;
      return true;
    }).length;
    const articleId = Object.keys(obj).reduce((pre, now) => {
      pre += ` OR a.id = ${now}`;
      return pre;
    }, '').replace(/[O][R]{1}/, '');
    const article = await this.app.mysql.query(`SELECT  a.*,b.name AS categoryName from article AS a INNER JOIN category AS b ON a.categoryId = b.id WHERE 
    a.name LIKE '%${name}%' AND 
    a.title LIKE '%${title}%' AND 
    a.title LIKE '%${title}%' AND 
    a.categoryId LIKE '%${categoryId}%' AND 
    ${articleId}
     ORDER BY updateTime DESC LIMIT ${--page * size},${parseInt(size)} `);
    const data = article.map(items => ({ ...items, tagName: tagName.filter(item => item.aid === items.id) }));
    return ({ total, data });
  }
  // 编辑文章
  async update(form) {
    let { tagId, id, ...rest } = form;
    await this.app.mysql.update('article', { id, ...rest });
    if (!tagId) return true;
    await this.app.mysql.delete('tagForArticle', {
      aid: id,
    });
    tagId = tagId.split(',');
    let data = tagId.map(item => (`(${item},${id})`)).join(',');
    data = data.replace(/[:]/g, ',');
    await this.app.mysql.query(`INSERT INTO tagForArticle(tid,aid)  VALUES ${data}`);

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

