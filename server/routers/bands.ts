/**
 * Band router
 */

import * as Resource from 'koa-resource-router';

import { Band } from '../models/Band';

module.exports = new Resource('bands', {

  // GET /bands
  index: [function* (next) {
    const query = {
      // 'year': {
      //   $ne: null
      // },
      'theme.0': {
        $exists: false
      }
    };

    this.count = yield Band.count(query).exec();
    this.bands = yield Band.find(query).exec();

    // this.bands = yield Band.aggregate({
    //   $group: {
    //     _id: '$country',
    //     total: { $sum: 1 }
    //   }
    // });

    yield next;
  }, function* () {
    this.body = {
      count: this.count,
      data: this.bands
    };
  }],

  // POST /bands
  create: function* () {
    const band = new Band(this.request.body);

    this.body = yield band.save();
  },

  // GET /bands/:id
  show: function* (next) {
  },

  // PUT /bands/:id
  update: function* (next) {
    const bandId = +this.request.url.match(/\d+$/)[0];

    this.body = yield Band.findOneAndUpdate({ bandId }, this.request.body, {
      new: true
    });
  },

  // DELETE /bands/:id
  destroy: function* (next) {
  }
});
