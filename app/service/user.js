'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
class HomeService extends Service {
  async checkPass(userName) {
    try {
      return (await this.app.mysql.select('user', {
        where: { userName },
        columns: [ 'passWord' ],
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
  async getVisitsCount() {
    return (await this.app.mysql.query('select visits from  user'));
  }
  async getAddVistis() {
    return (await this.app.mysql.query('update user set visits=visits+1 WHERE id = 1'));
  }
}

module.exports = HomeService;

