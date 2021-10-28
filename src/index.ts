#!/usr/bin/env node

import { init } from './next2ts.js';

init().catch((e) => {
  console.error(e);
});
