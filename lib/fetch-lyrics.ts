/**
 * Fetch data from www.darklyrics.com
 */

import * as fs from 'fs';
import * as path from 'path';
import { request, ClientRequest, IncomingMessage, RequestOptions } from 'http';

import { ALBUM_PATH, HTML_PATH } from './constants';

import { RequestQueue } from './request-queue';

fs.readdir(ALBUM_PATH, (err, files: string[]) => {
  let albums: string[] = [];

  const queue: RequestQueue = new RequestQueue(3000, (url, data) => {
    const bandName = url.split('/')[1];
    const albumName = url.replace(/(.+\/)|(\.html)/g, '');
    const filePath = path.join(HTML_PATH, bandName, `${albumName}.html`);

    fs.writeFile(filePath, data, () => {
      console.log(`saved: ${bandName} - ${albumName}`);
    });
  });

  files.forEach((file: string) => {
    const data = fs.readFileSync(path.join(ALBUM_PATH, file), 'UTF-8');

    albums = albums.concat(data.trim().split('\n'));
  });

  albums.forEach((album: string) => {
    const bandName = album.split('/')[1];
    const albumName = album.replace(/(.+\/)|(\.html)/g, '');
    const bandHtmlPath = path.join(HTML_PATH, bandName);

    if (!fs.existsSync(bandHtmlPath)) {
      fs.mkdir(bandHtmlPath);
    }

    const albumPath = path.join(bandHtmlPath, `${albumName}.html`);

    if (fs.existsSync(albumPath) && fs.statSync(albumPath).size) {
      console.log(`exists: ${bandName} - ${albumName}`);
      return;
    }

    queue.queue(album);
  });

  queue.sendRequest();
});
