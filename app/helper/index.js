'use strict';
const qiniu = require('qiniu');
module.exports = app => ({
  options: {
    scope: 'cherish553',
    expires: 7200,
  },
  putPolicy: null,
  mac: null,
  init() {
    const { AK, SK } = app.config.qiniu;
    this.mac = new qiniu.auth.digest.Mac(AK, SK);
    this.putPolicy = new qiniu.rs.PutPolicy(this.options);
  },
  getToken() {
    if (!this.mac || !this.putPolicy) this.init();
    return this.putPolicy.uploadToken(this.mac);
  },

});
