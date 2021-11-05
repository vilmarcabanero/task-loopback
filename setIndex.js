const fs = require('fs');
const config = require('./package.json');

/**
 * Overwrite the index.html file in the public folder to always reflect the contents of the package.json file
 */

const tpl = fs.readFileSync(`${process.cwd()}/index.tpl`).toString();
fs.writeFileSync(
  `${process.cwd()}/public/index.html`,
  tpl
    .replace('||name||', config.name)
    .replace('||description||', config.description)
    .replace('||version||', config.version),
);
