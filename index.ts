#!/usr/bin/env node
import program from 'commander';
import chalk from 'chalk';
import path from 'path';
import { Header } from './helpers/Header';
import { FolderExists } from './helpers/folder-exists';
import { setupProject } from './next-ts';

console.clear();

program
  .version('0.0.1')
  .description('Migrating Next.js to TypeScript utility')
  .option('-h, --help', 'Help command')
  .parse(process.argv);

if (program.opts().help) {
  Header();
  program.outputHelp();
  process.exit(0);
}

let resolvedProjectPath = process.cwd();
let currentPathName = path.basename(resolvedProjectPath);

async function init(): Promise<any> {
  console.log(
    `\nMigrating to your project ${chalk.blue(currentPathName)} to typescript`
  );

  await setupProject();
}

init().catch((e) => console.log(e));
