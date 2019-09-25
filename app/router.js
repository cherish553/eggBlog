'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
const user = require('./router/user');
const category = require('./router/category');
const tag = require('./router/tag');
const article = require('./router/article');
module.exports = app => {
  user(app);
  category(app);
  tag(app);
  article(app);
};
