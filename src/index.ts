#!/usr/bin/env node

import { init } from './next2ts';

init().catch((e) => {
  console.error(e);
});
