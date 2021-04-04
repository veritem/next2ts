#!/usr/bin/env node
const { access } = require('fs');
const { join } = require('path');
const chalk = require('chalk');
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

function folderExists(path) {
  return new Promise((resolve, reject) => {
    access(path, function (err) {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve(false);
        }
        return reject(err);
      }
      return resolve(true);
    });
  });
}

function hasYarn() {
  return fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));
}

async function init() {
  console.log();

  const baseName = path.basename(__dirname);

  let pagesExists = await folderExists(join(__dirname, 'pages'));
  let pagesExistsInSrc = await folderExists(join(__dirname, 'src/pages'));

  if (!pagesExists && !pagesExistsInSrc) {
    console.log('\n');
    console.log(chalk.yellowBright('next2ts\n'));
    console.log(chalk.red(`${baseName} is not a Next.js Project!`));
    process.exit(0);
  }
  if (hasYarn()) {
    execSync('yarn add --dev typescript @types/react @types/node');
  } else {
    execSync('npm install -D typescript @types/react @types/node');
  }
  execSync('touch tsconfig.json');
}

init().catch((e) => {
  console.error(e);
});
