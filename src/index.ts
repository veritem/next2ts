#!/usr/bin/env node

import program from 'commander';

console.clear();
program
  .version('0.0.1')
  .description('Convert you next.js project to typescript in minutes!')
  .option('-h,--help', 'Help message')
  .parse(process.argv);
