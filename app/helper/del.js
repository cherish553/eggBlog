'use strict';
const qiniu = require('qiniu');
module.exports = app => ({
  options: {
    scope: 'cherish553',
    expires: 7200,
  },
  name: '',
  bucketManager: null,
  init(name) {
    this.name = name;
    const { AK, SK } = app.config.qiniu;
    const mac = new qiniu.auth.digest.Mac(AK, SK);
    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;
    this.bucketManager = new qiniu.rs.BucketManager(mac, config);
  },
  delFile(name) {
    if (!this.bucketManager) return this.init(name);
    if (!name) name = this.name;
    this.bucketManager.delete(this.options.scope, name, function() {
      return true;
    });
  },

});
