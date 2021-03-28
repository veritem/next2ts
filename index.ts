#!/usr/bin/env node
import program from 'commander';
import chalk from 'chalk';
import path from 'path';
import { Header } from './helpers/Header';
import { FolderExists } from './helpers/folder-exists';
import { HandleInstallPackages } from './helpers/install';
import spinner from 'cli-spinners';
import logUpdate from 'log-update';

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

async function init(): Promise<any> {
  console.log(
    `\nMigrating to your project ${chalk.blue(currentPathName)} to typescript`
  );

  console.log('Folder exists ' + FolderExists('pages'));

  if (!FolderExists('pages') || !FolderExists('src/pages')) {
    console.clear();
    console.log('\n');
    console.log(chalk.yellowBright('Next2ts\n'));
    console.log(chalk.red(`This is not a Next.js Project!`));
    process.exit(0);
  }

  try {
    console.log(spinner.dots);
    let i = 0;
    setTimeout(() => {
      const { frames } = spinner.dots;
      logUpdate(frames[(i = ++i % frames.length)] + ' Unicorns');
    }, 3000);
    await HandleInstallPackages();
  } catch (error) {
    console.log(chalk.red(`Failed to install packages`));
    process.exit(0);
  }
}

init().catch((e) => console.log(e));
