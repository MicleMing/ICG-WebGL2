const webpack = require('webpack');
const webpackConf = require('../webpack.ui.config.js');

module.exports = function uiTask(task) {
  return new Promise((resolve, reject) => {
    console.log('start to build ui');
    webpack(webpackConf(task), (err, status) => {
      if (err) reject(err);
      else {
        console.log('success to build ui');
        resolve(status);
      }
    });
  });
};
