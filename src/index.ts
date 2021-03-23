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

program
  .version('0.0.1')
  .description("An example CLI for ordering pizza's")
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq', 'Add bbq sauce')
  .option('-c, --cheese <type>', 'Add the specified type of cheese [marble]')
  .option('-C, --no-cheese', 'You do not want any cheese')
  .parse(process.argv);
