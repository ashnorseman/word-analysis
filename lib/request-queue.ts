/**
 * Request Queue
 */

import * as events from 'events';
import { request, ClientRequest, IncomingMessage, RequestOptions } from 'http';

export class RequestQueue extends events.EventEmitter {
  private requests: any[] = [];

  constructor(
    private throttle: number,
    private callback: (req: any, data: string) => void
  ) {
    super();

    this.on('end', () => {
      this.requests.splice(0, 1);

      setTimeout(() => {
        this.sendRequest();
      }, this.throttle);
    });

    this.on('error', () => {
      console.log('error');
      this.requests.splice(0, 1);
      this.sendRequest();
    });
  }

  queue(options: any) {
    this.requests.push(options);
  }

  sendRequest() {
    const next = this.requests[0];

    if (!next) {
      this.emit('end-queue');
      return;
    }

    const req: ClientRequest = request(next);

    next.sending = true;

    req.on('response', (message: IncomingMessage) => {
      let data: string = '';

      message.on('data', (chunk: Buffer) => {
        data += chunk;
      });

      message.on('end', () => {
        next.sending = false;

        this.emit('end');

        if (!data) { return; }

        this.callback(next, data);
      });
    });

    req.on('error', () => {
      next.sending = false;

      this.emit('error');

      console.error(`error: ${JSON.stringify(next)}`);
    });

    if (next.body) {
      req.write(JSON.stringify(next.body));
    }

    req.end();

    setTimeout(() => {
      if (next.sending) {
        this.emit('end');
      }
    }, 30 * 1000);
  }
}
