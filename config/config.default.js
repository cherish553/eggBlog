/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
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
    ignore: [ '/user/login' ],
    cert: 'cherish',
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1567864018404_1531';


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
