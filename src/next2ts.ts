import fs from 'fs';
import path from 'path';
import { blue, green, red } from 'kolorist';
import execa from 'execa';
import get_files from 'rec-get-files';

const exec = (cmd: string, args: string[]) => {
  return execa(cmd, args);
};

const does_paths_exists = (paths: string): boolean => {
  return fs.existsSync(path.join(cwd + paths));
};

const cwd = process.cwd();

export async function init() {
  const root = path.basename(cwd);

  if (does_paths_exists("/package.json'")) {
    console.log(red(`\n${root} is not a next.js project`));
    process.exit(1);
  }

  console.log(blue(`\nMigrating ${root} to typescript`));

  if (!does_paths_exists('/pages') || !does_paths_exists('/src/pages')) {
    console.log(red(`\n${root} is not a next.js project`));
    process.exit(1);
  }

  let projectSource = does_paths_exists('/pages')
    ? path.join(cwd + '/pages')
    : path.join(cwd + '/src/pages');

  let componentSource = does_paths_exists('/components');
  let libComponentSource = does_paths_exists('/lib');

  fs.writeFile(
    cwd + '/tsconfig.json',
    `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]}`,
    (err) => {
      if (err) console.log(red('failed to write to tsconfig.json'));
      console.log(green('Wrote to tsconfig.json'));
    }
  );

  console.log('\n' + green('Renaming your files'));

  renameProjectFiles(projectSource);

  if (componentSource) renameComponentFiles(path.join(cwd + '/components'));
  if (libComponentSource) renameLibFiles(path.join(cwd + '/lib'));

  const allDependancies = ['typescript', '@types/react', '@types/node'];
  console.log(green('\nInstalling required packages\n'));
  allDependancies.map((dep) => console.log(`- ${dep}`));
  console.log('\n');

  return install(allDependancies).then(() => {
    console.log(blue('\nYou are ready to go 🚀'));
  });
}

function renameProjectFiles(source: string) {
  let files = get_js_files(source);

  return files.forEach((file) => {
    if (file.indexOf('/pages/api/') > -1) {
      const newFilename = file.split('.');
      const transformed = newFilename[0] + '.ts';
      fs.renameSync(file, transformed);
    } else {
      const newFilename = file.split('.');
      const transformed = newFilename[0] + '.tsx';
      fs.renameSync(file, transformed);
    }
  });
}

function renameComponentFiles(componentsSource: string) {
  let files = get_js_files(componentsSource);
  return files.forEach((file) => {
    const newFilename = file.split('.');
    const transformed = newFilename[0] + '.tsx';
    fs.renameSync(file, transformed);
  });
}

function renameLibFiles(libSource: string) {
  let files = get_js_files(libSource);
  return files.forEach((file) => {
    const newFilename = file.split('.');
    const transformed = newFilename[0] + '.ts';
    fs.renameSync(file, transformed);
  });
}

function get_js_files(path: string): string[] {
  const match = RegExp('^[^.]+.js$');
  return get_files(path).filter((file) => file.match(match));
}

async function install(dependancies: string[]) {
  try {
    const output = exec('npm', dependancies);
    console.log({ output });
  } catch (error) {
    console.log({ error });
  }
}
