// https://gist.github.com/scriptex/20536d8cda36221f91d69a6bd4a528b3

//TODO: (done) check for the project page directory
//TODO: (done) Rename all files in the tree
//TODO: Run  install

import spawn from 'cross-spawn';
import fs, { renameSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cwd = process.cwd();

function hasYarn() {
  return fs.existsSync(cwd, 'yarn.lock');
}

export async function init() {
  const root = path.basename(cwd);

  console.log(`\nMigrating ${root} to typescript...`);

  if (
    !(
      fs.existsSync(path.join(cwd + '/pages')) ||
      fs.existsSync(path.join(cwd + '/src/pages'))
    )
  ) {
    console.log(`\n${root} is not a next.js project`);
    process.exit(1);
  }

  let projectSource = fs.existsSync(path.join(cwd + '/pages'))
    ? path.join(cwd + '/pages')
    : path.join(cwd + '/src/pages');

  try {
    fs.copyFileSync(
      path.join(__dirname + '/template/tsconfig.json'),
      path.join(cwd + '/tsconfig.json')
    );
    console.log('\nInitilized tsconfig.json');
  } catch (e) {
    console.log('\nFailed to initialze tsconfig.json');
    process.exit(1);
  }

  renameFiles(projectSource);

  //TODO:

  // const allDependancies = ['typescript', '@types/react', '@types/node'];

  // return install(root, hasYarn(), allDependancies).then(() => {
  //   console.log('Installing...............');
  // });
}

function renameFiles(source) {
  let files = [];

  const getFilesRecursively = (directory) => {
    const filesInDirectory = fs.readdirSync(directory);
    for (const file of filesInDirectory) {
      const absolute = path.join(directory, file);
      if (fs.statSync(absolute).isDirectory()) {
        getFilesRecursively(absolute);
      } else {
        files.push(absolute);
      }
    }
  };

  getFilesRecursively(source);

  const match = RegExp('^[^.]+.js|jsx$');

  return files
    .filter((file) => file.match(match))
    .forEach((file) => {
      const filePath = (source, file);

      if (file.indexOf('/pages/api/') > -1) {
        const newFilename = file.split('.');
        const transformed = newFilename[0] + '.ts';
        renameSync(filePath, transformed);
      } else {
        const newFilename = file.split('.');
        const transformed = newFilename[0] + '.tsx';
        renameSync(filePath, transformed);
      }
    });
}

function install(root, useYarn, dependancies) {
  return new Promise((resolve, reject) => {
    let command;
    let args = [];

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
