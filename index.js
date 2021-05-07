#!/usr/bin/env node
const { init } = require('./next2ts.js');

init().catch((e) => {
  console.error(e);
});
