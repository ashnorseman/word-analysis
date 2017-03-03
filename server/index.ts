/**
 * Server
 */

import * as fs from 'fs';
import * as path from 'path';

import * as Koa from 'koa';
import * as bodyParser from 'koa-body';
import * as mongoose from 'mongoose';

const app = module.exports = new Koa();
const PORT = 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/band');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.on('connected', console.log.bind(console, 'connection connected'));

app.use(bodyParser({
  multipart: true,
  urlencoded: true
}));

fs.readdirSync(path.join(__dirname, './routers')).forEach((fileName: string) => {
  app.use(require(path.join(__dirname, './routers', fileName)).middleware());
});

if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
}
