//TODO: Run npm install
//TODO: check for the project page directory
//TODO: Rename all files in the tree

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// function folderExists(path) {
//   return new Promise((resolve, reject) => {
//     access(path, function (err) {
//       if (err) {
//         if (err.code === 'ENOENT') {
//           return resolve(false);
//         }
//         return reject(err);
//       }
//       return resolve(true);
//     });
//   });
// }

function hasYarn() {
  return fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));
}

export async function init() {
  const root = path.basename(__dirname);

  console.log(`\nMigrating ${root} to typescript...`);

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

  // if (hasYarn()) {
  //   console.log('Installing packages with yarn');
  // } else {
  //   console.log('Installing package with npm');
  // }

  // const baseName = path.basename(__dirname);

  // let pagesExists = await folderExists(join(__dirname, 'pages/index.js'));
  // let pagesExistsInSrc = await folderExists(
  //   join(__dirname, 'src/pages/index.js')
  // );

  // if (!pagesExists && !pagesExistsInSrc) {
  //   console.log('\n');
  //   console.log(chalk.yellowBright('next2ts\n'));
  //   console.log(chalk.red(`${baseName} is not a Next.js Project!`));
  //   process.exit(0);
  // }

  // if (hasYarn()) {
  //   //execSync('yarn add --dev typescript @types/react @types/node');
  // } else {
  //   //execSync('npm install -D typescript @types/react @types/node');
  // }
  //execSync('touch tsconfig.json');

  // fs.writeFile(
  //   'tsconfig.json',
  //   `
  // {
  //   "target": "es5",
  //   "lib": ["dom", "dom.iterable", "esnext"],
  //   "allowJs": true,
  //   "skipLibCheck": true,
  //   "strict": false,
  //   "forceConsistentCasingInFileNames": true,
  //   "noEmit": true,
  //   "esModuleInterop": true,
  //   "module": "esnext",
  //   "moduleResolution": "node",
  //   "resolveJsonModule": true,
  //   "isolatedModules": true
  // }
  //     `,
  // function (e) {
  //   if (e) throw e;
  //   console.log(chalk.blue(`Added tsconfig.json in the root`));
  // }
  // );

  //TODO: touch tsconfig.json
  //TODO: Rename file and folders to tsx
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
  });
}
