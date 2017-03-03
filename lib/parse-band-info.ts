/**
 * Parse band info
 */

import * as fs from 'fs';
import * as path from 'path';

const bandDataRaw = require('../data/band-info.json');

import { DATA_PATH } from './constants';

// ["<a href='http://www.metal-archives.com/bands/%21%C3%BAl../109481'>!úl..</a>","Czech Republic","Death/Black Metal","<span class=\"split_up\">Split-up</span>"]

const genres = Object.keys(bandDataRaw);
const result = {};
const reg = /(\d+)'>([^<]+)/;
const linkReg = /www\.metal-archives\.com\/([^']+)'/;

genres.forEach((genre) => {
  const genreBands = bandDataRaw[genre];

  genreBands.forEach((band) => {
    const bandExec = reg.exec(band[0]);
    const bandLinkExec = linkReg.exec(band[0]);

    if (!bandExec || !bandLinkExec) { return; }

    const bandId = +bandExec[1];

    if (!result[bandId]) {
      result[bandId] = {
        bandId,
        bandName: bandExec[2],
        genre: [genre],
        country: band[1],
        genreText: band[2],
        link: bandLinkExec[1]
      };
    } else if (result[bandId].genre.indexOf(genre) === -1) {
      result[bandId].genre.push(genre);
    }
  });
});

console.log(Object.keys(result).length);

fs.writeFile(path.join(DATA_PATH, './parsed-band-info.json'), JSON.stringify(result));
