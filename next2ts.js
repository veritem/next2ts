const { execSync } = require('child_process');
const fs,
  { renameSync } = require('fs');
const { blue, green, red } = require('kolorist');
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cwd = process.cwd();

function hasYarn() {
  try {
    const userAgent = process.env.npm_config_user_agent;
    if (userAgent) {
      return Boolean(userAgent && userAgent.startsWith('yarn'));
    }
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

export async function init() {
  const root = path.basename(cwd);

  if (!fs.existsSync(path.join(cwd + '/package.json'))) {
    console.log(red(`\n${root} is not a next.js project`));
    process.exit(1);
  }

  console.log(blue(`\nMigrating ${root} to typescript`));

  if (
    !(
      fs.existsSync(path.join(cwd + '/pages')) ||
      fs.existsSync(path.join(cwd + '/src/pages'))
    )
  ) {
    console.log(red(`\n${root} is not a next.js project`));
    process.exit(1);
  }

  let projectSource = fs.existsSync(path.join(cwd + '/pages'))
    ? path.join(cwd + '/pages')
    : path.join(cwd + '/src/pages');

  let componentSource = fs.existsSync(path.join(cwd + '/components'));
  let libComponentSource = fs.existsSync(path.join(cwd + '/lib'));

  try {
    fs.copyFileSync(
      path.join(__dirname + '/template/tsconfig.json'),
      path.join(cwd + '/tsconfig.json')
    );
    console.log('\nInitilized ' + blue('tsconfig.json'));
  } catch (e) {
    console.log('\nFailed to initialze tsconfig.json');
    process.exit(1);
  }

  console.log('\n' + green('Renaming your files'));

  renameProjectFiles(projectSource);

  if (componentSource) renameComponentFiles(path.join(cwd + '/components'));
  if (libComponentSource) renameLibFiles(path.join(cwd + '/lib'));

  const allDependancies = ['typescript', '@types/react', '@types/node'];
  console.log(green('\nInstalling required packages '));

  return install(root, hasYarn(), allDependancies).then(() => {
    console.log(blue('\nYou are ready to go 🚀'));
  });
}

function renameProjectFiles(source) {
  let files = [];

  const match = RegExp('^[^.]+.js|jsx$');

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

function renameComponentFiles(componentsSource) {
  let files = [];

  const match = RegExp('^[^.]+.js|jsx$');

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

  getFilesRecursively(componentsSource);

  return files
    .filter((file) => file.match(match))
    .forEach((file) => {
      const filePath = (componentsSource, file);

      const newFilename = file.split('.');
      const transformed = newFilename[0] + '.tsx';
      renameSync(filePath, transformed);
    });
}

function renameLibFiles(libSource) {
  let files = [];

  const match = RegExp('^[^.]+.js$');

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

  getFilesRecursively(libSource);

  return files
    .filter((file) => file.match(match))
    .forEach((file) => {
      const filePath = (libSource, file);

      const newFilename = file.split('.');
      const transformed = newFilename[0] + '.ts';
      renameSync(filePath, transformed);
    });
}

function install(root, useYarn, dependancies) {
  return new Promise((resolve, reject) => {
    let command;
    let args = [];

    if (useYarn) {
      command = 'yarnpkg';
      args = ['add', '-D', '--exact'].concat(dependancies);
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
