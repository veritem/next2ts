// https://gist.github.com/scriptex/20536d8cda36221f91d69a6bd4a528b3

//TODO: check for the project page directory
//TODO: Rename all files in the tree
//TODO: Run npm install

import spawn from 'cross-spawn';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export async function init() {
  const root = path.basename(__dirname);

  console.log(`\nMigrating ${root} to typescript...`);

  if (
    !folderExists(path.join(__dirname + '/pages')) ||
    !folderExists(path.join(__dirname + '/src/pages'))
  ) {
    throw new Error('This is not a next.js project');
  }

  let projectSource = folderExists(path.join(__dirname + '/pages'))
    ? path.join(__dirname + '/pages')
    : path.join(__dirname + '/src/pages');

  try {
    fs.copyFileSync(
      path.resolve('template/tsconfig.json'),
      __dirname + '/tsconfig.json'
    );
    console.log('\nInitilized tsconfig.json');
  } catch (e) {
    console.log('\nFailed to initialze tsconfig.json');
    process.exit(1);
  }

  const allDependancies = ['typescript', '@types/react', '@types/node'];

  return install(root, hasYarn(), allDependancies).then(() => {
    console.log('Installing...............');
  });
}

function install(root, useYarn, dependancies) {
  return new Promise((resolve, reject) => {
    let command;
    let args;

    if (useYarn) {
      command = 'yarn';
      args = ['add', '--dev'].push(dependancies);
      args.push('--cwd');
      args.push(root);
    } else {
      command = 'npm';
      args = ['install', '--save', '--save-exact', '--loglevel'].concat(
        dependancies
      );
    }

    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('close', (code) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}
