#!/usr/bin/env ts-node

import { init } from './next2ts';

init().catch((e) => {
  console.error(e);
});
