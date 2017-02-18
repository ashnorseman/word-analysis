/**
 * Request Queue
 */

import * as events from 'events';
import { request, ClientRequest, IncomingMessage, RequestOptions } from 'http';

export class RequestQueue extends events.EventEmitter {
  private requests: string[] = [];

  constructor(
    private throttle: number,
    private callback: (url: string, data: string) => void
  ) {
    super();

    this.on('end', () => {
      this.requests.splice(0, 1);

      setTimeout(() => {
        this.sendRequest();
      }, this.throttle);
    });

    this.on('error', (error) => {
      this.requests.splice(0, 1);

      console.error(error);
    });
  }

  queue(url: string) {
    this.requests.push(url);
  }

  sendRequest() {
    const url = this.requests[0];

    if (!url) { return; }

    const options: RequestOptions = {
      hostname: 'www.darklyrics.com',
      path: `/${url}`
    };

    const req: ClientRequest = request(options);

    req.on('response', (message: IncomingMessage) => {
      let data: string = '';

      message.on('data', (chunk: Buffer) => {
        data += chunk;
      });

      message.on('end', () => {
        this.emit('end');

        if (!data) { return; }

        this.callback(url, data);
      });
    });

    req.on('error', () => {
      this.emit('error');

      console.error(`error: ${url}`);
    });

    req.end();
  }
}
