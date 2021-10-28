#!/usr/bin/env ts-node
import { init } from './next2ts';
init()["catch"](function (e) {
    console.error(e);
});
