/**
 * Fetch data from www.darklyrics.com
 */

import * as fs from 'fs';
import * as path from 'path';
import { request, ClientRequest, IncomingMessage, RequestOptions } from 'http';

import { BAND_PATH } from './constants';

for (let i: string = 'a'; i <= 'z'; i = String.fromCharCode(i.charCodeAt(0) + 1)) {

  // Link format: `http://www.darklyrics.com/a.html`
  const options: RequestOptions = {
    hostname: 'www.darklyrics.com',
    path: `/${i}.html`
  };

  const req: ClientRequest = request(options);

  req.on('response', (message: IncomingMessage) => {
    let data: string = '';
    let bandLinks: string[] = [];

    message.on('data', (chunk: Buffer) => {
      data += chunk;
    });

    message.on('end', () => {
      const hrefReg = new RegExp(`href="(${i}/.+?\.html)"`, 'g');

      bandLinks = data.match(hrefReg)
        .map((link) => link.replace(/(^href=")|("$)/g, ''));

      fs.writeFile(path.join(BAND_PATH, `${i}.txt`), bandLinks.join('\n'));
    });
  });

  req.end();
}
