'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
class HomeService extends Service {
  // async index() {
  //   return await (this.app.mysql.query('select * from  user'));
  // }
  async checkPass(userName) {
    try {
      return (await this.app.mysql.select('user', { // 搜索 post 表
        where: { userName }, // WHERE 条件
        columns: [ 'passWord' ], // 要查询的表字段
        // orders: [['created_at','desc'], ['id','desc']], // 排序方式
        // limit: 10, // 返回数据量
        // offset: 0, // 数据偏移量
      }))[0].passWord;
    } catch (err) {
      return false;
    }
  }
  async login() {
    const token = jwt.sign({
      id: 'likefan',
    }, this.app.config.jwt.cert, {
      expiresIn: '10h', // token过期时间
    });
    return { ...(await this.app.mysql.query('select name from  user'))[0], token };
  }
}

module.exports = HomeService;

