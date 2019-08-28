#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chapterTask = require('./chapter-task');
const uiTask = require('./ui-task');

async function buildChapters() {
  fs.readdirSync('./src')
    .filter(item => /^chapter/.test(item))
    .map(async item => await chapterTask(item));
}

async function buildUI() {
  await uiTask();
}

async function buildEntry() {
  console.log('start to build entry');
  const chapters = fs.readdirSync('./src')
    .filter(item => /^chapter/.test(item));

  const topics = chapters.map((chapter) => {
    const targetDir = path.join('./src', chapter);
    const childDirs = fs.readdirSync(targetDir);
    const items = childDirs.map((dir) => {
      const name = `${chapter}/${dir}`;
      return `<p class='topic'><a target='_blank' href='./${name}'>${dir}<a></p>`
    }).join('');
    return `<h>${chapter}</h>${items}`
  }).join('');

  const output = `
  <html>
    <head>
      <title>WebGL</title>
      <style>
        h { font-size: 20px }
        .topic { text-indent: 2em; }
      </style>
    </head>
    <body>
    ${topics}
    <div id="github_fork" style="position:absolute;top:0;right:0;width:80px;height:80px;z-index:99999;">
      <a href="https://github.com/MicleMing/ICG-WEBGL2">
      <svg viewBox="0 0 250 250" aria-hidden="true" color="#fff">
      <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
      <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
      <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body">
      </path>
    </svg>
      </a>
    </div>
    </body>
  </html>
    `;
  fs.writeFileSync('./docs/index.html', output);
  console.log('success to build entry');
}

(async function () {
  await buildChapters();
  await buildUI();
  await buildEntry();
})();




