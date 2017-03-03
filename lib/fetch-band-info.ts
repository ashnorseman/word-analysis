/**
 * Fetch band info
 */

import * as fs from 'fs';
import * as path from 'path';
import { request, ClientRequest, IncomingMessage, RequestOptions } from 'http';

import { RequestQueue } from './request-queue';

const genreItems = {
  black: 29966,
  death: 39169,
  doom: 11117,
  electronic: 1143,
  avantgarde: 1133,
  folk: 2788,
  gothic: 3408,
  grind: 4738,
  groove: 4409,
  heavy: 16803,
  metalcore: 4316,
  power: 7124,
  prog: 9287,
  speed: 2150,
  orchestral: 2768,
  thrash: 24514
};

const result = {
  black: [],
  death: [],
  doom: [],
  electronic: [],
  avantgarde: [],
  folk: [],
  gothic: [],
  grind: [],
  groove: [],
  heavy: [],
  metalcore: [],
  power: [],
  prog: [],
  speed: [],
  orchestral: [],
  thrash: []
};

const queue: RequestQueue = new RequestQueue(3000, (req, data) => {
  let res;

  try {
    res = JSON.parse(data)['aaData'];
  } catch (e) {
    console.error(e);
  }

  if (res && res.length) {
    result[req.data] = result[req.data].concat(res);
  }
});

queue.on('end-queue', () => {
  fs.writeFile(path.join(__dirname, '../data/band-info.txt'), JSON.stringify(result));
});

Object.keys(genreItems).forEach((genre: string) => {
  fetchGenre(genre, genreItems[genre]);
});

function fetchGenre(genre, itemCount) {
  const pageCount = 500;
  const max = Math.ceil(itemCount / pageCount);

  for (let page = 1; page <= max; page += 1) {
    queue.queue({
      hostName: 'www.metal-archives.com',
      path: `/browse/ajax-genre/g/${genre}/json/1?sEcho=1&iColumns=4&sColumns=&iDisplayStart=${pageCount * (page - 1)}&iDisplayLength=500&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&iSortCol_0=0&sSortDir_0=asc&iSortingCols=1&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=false`
    });
  }
}

queue.sendRequest();
