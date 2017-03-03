/**
 * Band Query
 */

import { RequestQueue } from '../lib/request-queue';

function start() {
  const queue = new RequestQueue(0, (req, bandData) => {
    const statusReg = /<dt>Status:<\/dt>\s+<dd [^>]+>([^<]+)/;
    const yearReg = /<dt>Formed in:<\/dt>\s+<dd>([^<]+)/;
    const themeReg = /<dt>Lyrical themes:<\/dt>\s+<dd>([^<]+)/;

    const bandQueue = new RequestQueue(3000, (r, data) => {
      const statusExec = statusReg.exec(data);
      const yearExec = yearReg.exec(data);
      const themeExec = themeReg.exec(data);

      if (!statusExec || !yearExec) { return; }

      const status = statusExec[1];
      const year = +yearExec[1];
      const theme = themeExec[1];

      r.data.status = status;
      r.data.year = year;
      r.data.theme = theme.toLocaleLowerCase().replace(/\s?\(\w+\)/g, '').split(/,\s/);

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
        path: `/${item.link}`,
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
