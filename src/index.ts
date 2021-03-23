#!/usr/bin/env node
import program from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';

program
  .version('0.0.1')
  .description('Convert you next.js project to typescript in minutes!')
  .option('-h,--help', 'Help message')
  .parse(process.argv);

console.clear();
console.log(
  chalk.blueBright.bold(
    figlet.textSync('next-ts', { horizontalLayout: 'full' })
  )
);
