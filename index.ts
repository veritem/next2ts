#!/usr/bin/env node

import program from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import path from 'path';

console.clear();
console.log(
  chalk.blueBright.bold(
    figlet.textSync('next-ts', { horizontalLayout: 'full' })
  )
);

program
  .version('0.0.1')
  .description('Migrating Next.js to TypeScript utility')
  .option('-h, --help', 'Help command')
  .parse(process.argv);

// print help message
if (program.opts().help) {
  program.outputHelp();
  process.exit(0);
}

let resolvedProjectPath = process.cwd();
let currentPath = path.basename(resolvedProjectPath);

//TODO:
// console.log({ currentPath });
// check if the project is a valid next.js Project
// check if there exists page directory
// Check if the folder is granted access to be writable
// Run npm installs

async function init(): Promise<any> {
  console.log(
    `\nMigrating to your project ${chalk.blue(currentPath)} to typescript`
  );
}

// initialize the application
init().catch((e) => console.log(e));
