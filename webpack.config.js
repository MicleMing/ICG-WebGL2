const path = require('path');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = env => {
  const targetDir = path.join(__dirname, 'src', env);

  const childDirs = fs.readdirSync(targetDir);
  const entry = childDirs.reduce((acc, dir) => {
    acc[dir] = path.join(targetDir, dir, 'index.ts');
    return acc;
  }, {});


  const copyAssets = (acessets, target = '') => {
    return childDirs.reduce((acc, dir) => {
      const from = path.join(targetDir, dir, acessets);
      if (fs.existsSync(from)) {
        const to = path.join(dir, target);
        acc = acc.concat({ from, to });
      }
      return acc;
    }, []);
  }

  const copyHtml = copyAssets('index.html');
  const copyImages = copyAssets('images', 'images');



  console.log(copyHtml)
  return {
    entry: entry,
    output: {
      filename: "[name]/index.js",
      path: path.resolve(__dirname, "./dist")
    },

    devtool: "source-map",

    resolve: {
      extensions: [".ts", ".js", ".json"]
    },

    module: {
      rules: [
        { test: /\.(swf|ttf|eot|svg|woff(2))(\?[a-z0-9]+)?$/, use: ['file-loader'] },
        { test: /\.ts$/, loader: "awesome-typescript-loader" },
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        {
          test: /\.(frag|vert|glsl)$/,
          use: {
            loader: 'glsl-shader-loader',
            options: {},
          },
        },
      ]
    },
    plugins: [
      new CopyPlugin(copyHtml.concat(copyImages)),
    ],
  }
};
