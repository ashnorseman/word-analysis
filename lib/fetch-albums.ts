/**
 * Fetch data from www.darklyrics.com
 */

import * as fs from 'fs';
import * as path from 'path';
import { request, ClientRequest, IncomingMessage, RequestOptions } from 'http';

import { BAND_PATH, ALBUM_PATH } from './constants';

fs.readdir(BAND_PATH, (error, files: string[]) => {

  files.forEach((file: string) => {

    fs.readFile(path.join(BAND_PATH, file), 'UTF-8', (error, data: string) => {
      const bands: string[] = data.trim().split('\n');

      bands.forEach((band: string) => {

        // Extract band name from format `a/andras.html`
        const bandName = band.replace(/([^/]+\/)|(\.html)/g, '');

        if (fs.existsSync(path.join(ALBUM_PATH, `${bandName}.txt`))) {
          console.log(`fetched: ${bandName}`);
          return;
        }

        console.log(`start: ${bandName}`);

        // Link format: `http://www.darklyrics.com/a/andras.html`
        const options: RequestOptions = {
          hostname: 'www.darklyrics.com',
          path: `/${band}`
        };

        const req: ClientRequest = request(options);

        req.on('response', (message: IncomingMessage) => {
          let data: string = '';
          let albumLinks: string[] = [];

          message.on('data', (chunk: Buffer) => {
            data += chunk;
          });

          message.on('end', () => {
            const hrefReg = new RegExp(`href="\.\.\/lyrics\/${bandName}/.+?\.html`, 'g');
            const result = data.match(hrefReg);

            if (!result) return;

            console.log(`band: ${bandName}`);

            // Filter duplicate links
            albumLinks = result
              .filter((link, i) => result.indexOf(link) === i)
              .map((link) => link.replace(/(^href="\.\.\/)|("$)/g, ''));

            fs.writeFile(path.join(ALBUM_PATH, `${bandName}.txt`), albumLinks.join('\n'));
          });
        });

        req.on('error', () => {
          console.error(`error: ${bandName}`);
        });

        req.end();
      });
    });
  });
});
