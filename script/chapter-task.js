const webpack = require('webpack');
const webpackConf = require('../webpack.config.js');

module.exports = function chapterTask(task) {
  return new Promise((resolve, reject) => {
    console.log('start to build task: ', task);
    webpack(webpackConf(task), (err, status) => {
      if (err) reject(err);
      else {
        console.log('success to build task: ', task);
        resolve(status);
      }
    });
  });
};
