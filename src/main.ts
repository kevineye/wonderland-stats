#!/usr/bin/env node
import * as express from 'express';
import { Command } from 'commander';
import { getWonderlandStats } from './stats';

const options = new Command()
  .option('-s, --server', 'run server')
  .option('-p, --port <port>', 'server port', '3000')
  .parse()
  .opts();

if (options.server) {

  const app = express();
  const port = Number(options.port);

  app.get('/wonderland/stats', async (_req, res) => {
    res.json(await (getWonderlandStats()));
  });

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/wonderland/stats`);
  });

} else {

  (async () => {
    console.log(JSON.stringify(await (getWonderlandStats()), null, 2));
  })();

}
