/**
 * Temp
 */

import { RequestQueue } from '../lib/request-queue';

const parsedBandInfo = require('../data/parsed-band-info.json');

const queue = new RequestQueue(0, (req, data) => {
  console.log(data);
});

Object.keys(parsedBandInfo).forEach((bandId) => {
  queue.queue({
    hostname: 'localhost',
    port: 3000,
    path: `/bands/${bandId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: parsedBandInfo[bandId]
  });
});

queue.sendRequest();
