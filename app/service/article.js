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
    const data = (await this.app.mysql.select('article', { where: { id }, columns: [ 'id', 'name', 'title', 'inner', 'categoryId', 'visits', 'star', 'creatTime', 'updateTime' ] }))[0];
    const { id: aid } = data;
    const tagName = await this.app.mysql.query(`SELECT DISTINCT a.aid,a.tid AS tagId,b.NAME AS tagName FROM tagForArticle AS a INNER JOIN tag AS b ON a.tid = b.id WHERE aid=${aid}`);
    return ([ data ].map(items => ({ ...items, tagName: tagName.filter(item => item.aid === items.id) })))[0];
  }
  // 查询文章列表
  async list({ name, page, size, title, categoryId, tagId, show }) {
    let condition = '';
    if (!show) condition = 'a.show = 1 AND';
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
    ${condition}
    a.name LIKE '%${name}%' AND 
    a.title LIKE '%${title}%' AND 
    a.title LIKE '%${title}%' AND 
    a.categoryId LIKE '%${categoryId}%' AND 
    (${articleId})
     ORDER BY a.show DESC,status DESC,updateTime DESC LIMIT ${--page * size},${parseInt(size)} `);
    const data = article.map(items => ({ ...items, tagName: tagName.filter(item => item.aid === items.id) }));
    return ({ total, data });
  }
  // 编辑文章
  async update(form) {
    let { tagId, id, ...rest } = form;
    const updateTime = new Date();
    await this.app.mysql.update('article', { id, ...rest, updateTime });
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
  // 点赞文章
  async star(id) {
    await this.app.mysql.query(`update article set star=star+1 WHERE id=${id}`);
    return true;
  }
  // 文章增加访问量
  async visits(id) {
    await this.app.mysql.query(`update article set visits=visits+1 WHERE id=${id}`);
    return true;
  }
  // 根据文章名称查询文章
  async searchForName(name) {
    const article = await this.app.mysql.query(`SELECT  a.*,b.name AS categoryName from article AS a INNER JOIN category AS b ON a.categoryId = b.id  WHERE a.show=1
         ORDER BY updateTime DESC`);
    const tagName = await this.app.mysql.query('SELECT DISTINCT a.aid,a.tid,b.NAME AS tagName FROM tagForArticle AS a INNER JOIN tag AS b ON a.tid = b.id');
    const data = article.map(items => ({
      ...items,
      tagName: tagName.filter(item => item.aid === items.id),
    }))
      .filter(item => (item.title.search(name) !== -1
        || item.title.search(name) !== -1
        || item.categoryName.search(name) !== -1
        || item.tagName.some(item => item.tagName.search(name) !== -1)) && item.tagName.length);
    return data;
  }
  // 根据类别id查询文章
  async searchForCategoryId(id) {
    const article = await this.app.mysql.query(`SELECT  a.*,b.name AS categoryName from article AS a INNER JOIN category AS b ON a.categoryId = b.id  
     WHERE categoryId = ${id} AND  a.show=1
     ORDER BY updateTime DESC`);
    const tagName = await this.app.mysql.query('SELECT DISTINCT a.aid,a.tid,b.NAME AS tagName FROM tagForArticle AS a INNER JOIN tag AS b ON a.tid = b.id');
    const data = article.map(items => ({ ...items, tagName: tagName.filter(item => item.aid === items.id) }));
    return data;
  }
  // 根据标签id查询文章
  async searchFortagId(id) {
    const aid = (await this.app.mysql.query(`SELECT DISTINCT a.aid FROM tagForArticle AS a INNER JOIN tag AS b ON a.tid = b.id  WHERE tid=${id}`)).map(item => item.aid);
    if (!aid.length) return [];
    const articleId = [ ...new Set(aid) ].reduce((pre, now) => {
      pre += ` OR a.id=${now}`;
      return pre;
    }, '').replace(/[O][R]{1}/, '');
    id = [ ...new Set(aid) ].reduce((pre, now) => {
      pre += ` OR aid=${now}`;
      return pre;
    }, '').replace(/[O][R]{1}/, '');
    const tagName = await this.app.mysql.query(`SELECT DISTINCT a.aid,a.tid,b.NAME AS tagName FROM tagForArticle AS a INNER JOIN tag AS b ON a.tid = b.id WHERE ${id}`);
    const article = await this.app.mysql.query(`SELECT  a.*,b.name AS categoryName from article AS a INNER JOIN category AS b ON a.categoryId = b.id WHERE 
    (${articleId})
    AND  a.show=1
     ORDER BY updateTime DESC`);
    const data = article.map(items => ({ ...items, tagName: tagName.filter(item => item.aid === items.id) }));
    return data;
  }
  // 根据文章类型获取文章
  async filter(type) {
    let data = [];
    let tagName = [];
    let article = [];
    switch (parseInt(type)) {
      case 0:
        article = await this.app.mysql.query(`SELECT  a.*,b.name AS categoryName from article AS a INNER JOIN category AS b ON a.categoryId = b.id WHERE status=2 AND a.show=1
         ORDER BY updateTime DESC`);
        tagName = await this.app.mysql.query('SELECT DISTINCT a.aid,a.tid,b.NAME AS tagName FROM tagForArticle AS a INNER JOIN tag AS b ON a.tid = b.id');
        data = article.map(items => ({ ...items, tagName: tagName.filter(item => item.aid === items.id) }));
        break;
      case 1:
        article = await this.app.mysql.query(`SELECT  a.*,b.name AS categoryName from article AS a INNER JOIN category AS b ON a.categoryId = b.id  WHERE a.show=1
          ORDER BY updateTime DESC LIMIT 0,5`);
        tagName = await this.app.mysql.query('SELECT DISTINCT a.aid,a.tid,b.NAME AS tagName FROM tagForArticle AS a INNER JOIN tag AS b ON a.tid = b.id');
        data = article.map(items => ({ ...items, tagName: tagName.filter(item => item.aid === items.id) }));
        break;
      default:
        article = await this.app.mysql.query(`SELECT  a.*,b.name AS categoryName from article AS a INNER JOIN category AS b ON a.categoryId = b.id   WHERE a.show=1
        ORDER BY visits DESC ,star DESC
        LIMIT 0,10
      `);
        tagName = await this.app.mysql.query('SELECT DISTINCT a.aid,a.tid,b.NAME AS tagName FROM tagForArticle AS a INNER JOIN tag AS b ON a.tid = b.id ');
        data = article.map(items => ({ ...items, tagName: tagName.filter(item => item.aid === items.id) }));
        break;
    }
    return data;
  }
}

module.exports = HomeService;

