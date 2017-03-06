/**
 * Band Query
 */

import { RequestQueue } from '../lib/request-queue';

function start() {
  const queue = new RequestQueue(0, (req, bandData) => {
    const contentReg = /<tbody>(.+)<\/tbody>/;
    const nameReg = /www.metal-archives.com([^"]+)"[^>]+>([^<]+)/;

    const bandQueue = new RequestQueue(2000, (r, data) => {
      const contentExec = contentReg.exec(data.trim().replace(/\n/g, ''));

      if (!contentExec) { return; }

      r.data.album = contentExec[1].trim()
        .replace(/>\s+</g, '><')
        .replace(/(^<tr>)|(<\/tr>$)/g, '')
        .split(/<\/tr><tr>/)
        .map((text: string) => {
          const data = text
            .replace(/(^<td>)|(<\/td>$)/g, '')
            .split(/<\/td><td[^<]*>/);

          const type: string = data[1];
          const year: number = +data[2];

          const nameExec = nameReg.exec(data[0]);

          if (!nameExec) { return; }

          return {
            albumName: nameExec[2],
            link: nameExec[1],
            type,
            year
          };
        });

      const saveQueue = new RequestQueue(0, (s, d) => {
        try {
          console.log(`saved: ${JSON.parse(d)['bandId']} at ${new Date()}`);
        } catch (e) {
          console.log(`save error: ${e}`);
        }
      });

      saveQueue.queue({
        hostname: 'localhost',
        port: 3000,
        path: `/bands/${r.data.bandId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: r.data
      });

      saveQueue.sendRequest();
    });

    JSON.parse(bandData)['data'].forEach((item) => {
      bandQueue.queue({
        host: 'www.metal-archives.com',
        hostName: 'www.metal-archives.com',
        path: `/band/discography/id/${item.bandId}/tab/all`,
        data: item
      });
    });

    bandQueue.on('error', () => {
      console.log('error exit');
    });

    bandQueue.sendRequest();
  });

  queue.queue({
    hostname: 'localhost',
    port: 3000,
    path: `/bands`,
  });

  queue.sendRequest();
}

start();
