'use strict';

import * as fs from 'fs';
import * as path from 'path';

import { TAGGED_TEXT_PATH } from '../constants';

const lemma = require('../lemma.json');

const WHITE_LIST = [
  't', 'm', 're', 'll', 've', 'don', 'doesn',
  'much',
  'one',
  'be', 'have', 'do', 'take', 'get', 'make', 'let'
];

const POS = ['NN', 'NNS', 'JJ', 'JJR', 'JJS'];

fs.readdir(TAGGED_TEXT_PATH, (error, bands) => {
  const theme = 'love';
  const result = {
    'NN': [],
    'NNS': [],
    'JJ': [],
    'JJR': [],
    'JJS': []
  };

  bands.forEach((band) => {
    if (!/^\w/.test(band)) { return; }

    const bandPath = path.join(TAGGED_TEXT_PATH, band);
    const files = fs.readdirSync(bandPath);

    if (!files.length) {
      return;
    }

    files.forEach((file) => {
      const taggedWords = JSON.parse(fs.readFileSync(path.join(bandPath, file), 'UTF-8'));

      // Store nouns, adjectives, adverbs and verbs
      taggedWords.forEach((pair, index) => {
        let word = pair[0].toLocaleLowerCase();

        if (lemma[word]) {
          word = lemma[word];
        }

        if (word === theme) {
          testCollo(taggedWords[index - 2], result, taggedWords[index - 1]);
          testCollo(taggedWords[index - 1], result);
        }
      });
    });
  });

  fs.writeFile(path.join(__dirname, '../../gen-data/love.txt'), JSON.stringify(result));
});

function testCollo(item, result, noPunc?) {
  if (
    item &&
    (POS.indexOf(item[1]) !== -1) &&
    (WHITE_LIST.indexOf(lemma[item[0]] ? lemma[item[0]] : item[0]) === -1) &&
    (!noPunc || (/\w/.test(noPunc[1][0])))
  ) {
    result[item[1]].push(item[0]);
  }
}
