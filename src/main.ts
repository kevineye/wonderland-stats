#!/usr/bin/env node
import { getWonderlandStats } from './stats';

(async () => {
    console.log(await(getWonderlandStats()));
})();
