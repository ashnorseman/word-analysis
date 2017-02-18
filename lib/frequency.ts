'use strict';

import * as fs from 'fs';
import * as path from 'path';

import { TAGGED_TEXT_PATH, FREQUENCY_PATH } from './constants';

const lemma = require('./lemma.json');

const WHITE_LIST = [
  't', 'm', 're', 'll', 've', 'don', 'doesn',
  'much',
  'one',
  'be', 'have', 'do', 'take', 'get', 'make', 'let'
];

const NOUN_POS = ['NN', 'NNS'];
const ADJ_POS = ['JJ', 'JJR', 'JJS'];
const ADV_POS = ['RB', 'RBR', 'RBS'];
const VERB_POS = ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'];

fs.readdir(TAGGED_TEXT_PATH, (error, bands) => {

  bands.forEach((band) => {
    if (!/^\w/.test(band)) { return; }

    const bandPath = path.join(TAGGED_TEXT_PATH, band);
    const files = fs.readdirSync(bandPath);

    if (!files.length) {
      console.error(`no data: ${band}`);
      return;
    }

    let bandNouns = [];
    let bandAdjs = [];
    let bandAdvs = [];
    let bandVerbs = [];

    let readBandName = '';

    files.forEach((file) => {
      readBandName = file.split(/ \[/)[0].trim();

      const taggedWords = JSON.parse(fs.readFileSync(path.join(bandPath, file), 'UTF-8'));

      // Store nouns, adjectives, adverbs and verbs
      taggedWords.forEach((pair) => {
        let word = pair[0].toLocaleLowerCase();

        if (lemma[word]) {
          word = lemma[word];
        }

        if (WHITE_LIST.indexOf(word) !== -1) { return; }

        if (NOUN_POS.indexOf(pair[1]) !== -1) {
          bandNouns.push(word);
        } else if (ADJ_POS.indexOf(pair[1]) !== -1) {
          bandAdjs.push(word);
        } else if (ADV_POS.indexOf(pair[1]) !== -1) {
          bandAdvs.push(word);
        } else if (VERB_POS.indexOf(pair[1]) !== -1) {
          bandVerbs.push(word);
        }
      });
    });

    const result = {
      noun: statList(bandNouns),
      adj: statList(bandAdjs),
      adv: statList(bandAdvs),
      verb: statList(bandVerbs)
    };

    console.log(`writing: ${readBandName}`);

    fs.writeFileSync(path.join(FREQUENCY_PATH, `${readBandName} - ${band}.txt`), JSON.stringify(result));
  });
});


function statList(wordList) {
  const wordMap = new Map();

  wordList.forEach((word) => {
    if (lemma[word]) {
      word = lemma[word];
    }

    if (!wordMap.get(word)) {
      wordMap.set(word, 1);
    } else {
      wordMap.set(word, wordMap.get(word) + 1);
    }
  });

  return Array.from(wordMap.keys())
    .sort((a, b) => wordMap.get(b) - wordMap.get(a))
    .map((word) => ({
      word,
      count: wordMap.get(word)
    }));
}
