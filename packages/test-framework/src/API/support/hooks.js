'use strict';

const { After, AfterAll, Before, BeforeAll } = require('@cucumber/cucumber');
const { beforeAllHook, beforeHook, afterHook, afterAllHook } = require('../hooks');

BeforeAll(beforeAllHook);
Before(beforeHook);
After(afterHook);
AfterAll(afterAllHook);
