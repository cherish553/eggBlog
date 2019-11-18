/* eslint valid-jsdoc: "off" */

'use strict';
// or
// import * as qiniu from 'qiniu-js'
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
  };
  // mysql
  config.mysql = {
    client: {
      host: 'localhost',
      user: 'root',
      password: '4130801asd',
      port: '3306',
      database: 'cherish',
    },
    app: true,
    agent: false,
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };
  // add your middleware config here
  config.middleware = [ 'jwt' ];
  // // 注册jwt
  config.jwt = {
    enable: true,
    ignore: [ '/blog/user/login',
      '/blog/article/list/:page/:size',
      '/blog/category/list/:page/:size',
      '/blog/tag/list/:page/:size',
      '/blog/article/star/:id',
      '/blog/article/visits/:id',
      '/blog/article/filter/:type',
      '/blog/article/searchForName',
      '/blog/article/searchForCategoryId',
      '/blog/article/searchFortagId',
      '/blog/article/search/:id',
      '/blog/user/getVisitsCount',
      '/blog/user/getAddVistis' ],
    cert: 'cherish',
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1567864018404_1531';
  config.qiniu = {
    AK: 'yuVMk91p045VZ7d1jB_awJ5FFC63vJ1g-zjnZ4xY',
    SK: 'JyCnbJgKkHHzzzYGicyLDKe3HznbDBgxQSse2vjG',
  };
  process.env.NODE_ENV === 'development' ? '' : config.cluster = {
    listen: {
      port: 3000,
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
