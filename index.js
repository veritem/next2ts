#!/usr/bin/env node

console.log('test');

async function init() {}

init().catch((e) => {
  console.error(e);
});
