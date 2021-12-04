#!/usr/bin/env node
import * as express from 'express';
import { getWonderlandStats } from './stats';

const app = express();

app.get('/wonderland-stats', async (_req, res) => {
  res.json(await (getWonderlandStats()));
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
