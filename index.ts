#! /usr/bin/env node
import program from 'commander';
import chalk from 'chalk';
import path from 'path';
import { Header } from './helpers/Header';
import { FolderExists } from './helpers/folder-exists';
import { HandleInstallPackages } from './helpers/install';

console.clear();

program
  .version('0.0.1')
  .description('Migrating Next.js to TypeScript utility')
  .option('-h, --help', 'Help command')
  .parse(process.argv);

// print help message
if (program.opts().help) {
  Header();
  program.outputHelp();
  process.exit(0);
}

let resolvedProjectPath = process.cwd();
let currentPathName = path.basename(resolvedProjectPath);

//TODO:

// -[ ] check if the project is a valid next.js Project
// -[ ] check if there exists page directory
// -[ ] Check if the folder is granted access to be writable
// Run npm installs

async function init(): Promise<any> {
  console.log(
    `\nMigrating to your project ${chalk.blue(currentPathName)} to typescript`
  );

  if (FolderExists('pages') || FolderExists('src/pages')) {
    console.clear();
    console.log(chalk.red(`\nThis is not a Next.js Project`));
  }

  await HandleInstallPackages();
}
// initialize the application
init().catch((e) => console.log(e));
