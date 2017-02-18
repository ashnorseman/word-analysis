'use strict';

import * as fs from 'fs';
import * as path from 'path';

import { FREQUENCY_PATH, ANALYSIS_PATH } from './constants';

const lemma = require('./lemma.json');
const emotion = require('./emotion.json');

const bands = fs.readdirSync(FREQUENCY_PATH);

let totalNouns = [];
let totalAdjs = [];
let totalAdvs = [];
let totalVerbs = [];

const pnMap: {} = {};

bands.forEach((band) => {
  if (!/^\[/.test(band)) { return; }

  const bandStat = JSON.parse(fs.readFileSync(path.join(FREQUENCY_PATH, band), 'UTF-8'));

  const result: any = analysis(bandStat, band.split('.')[0]);

  pnMap[band.split('.')[0]] = (result.positive / result.negative).toFixed(2);

  totalNouns = totalNouns.concat(bandStat.noun);
  totalAdjs = totalAdjs.concat(bandStat.adj);
  totalAdvs = totalAdvs.concat(bandStat.adv);
  totalVerbs = totalVerbs.concat(bandStat.verb);
});

fs.writeFileSync(path.join(ANALYSIS_PATH, '../all-noun.txt'), JSON.stringify(merge(totalNouns)));
fs.writeFileSync(path.join(ANALYSIS_PATH, '../all-adj.txt'), JSON.stringify(merge(totalAdjs)));
fs.writeFileSync(path.join(ANALYSIS_PATH, '../all-adv.txt'), JSON.stringify(merge(totalAdvs)));
fs.writeFileSync(path.join(ANALYSIS_PATH, '../all-verb.txt'), JSON.stringify(merge(totalVerbs)));

const pnOrder = Object.keys(pnMap).sort((a, b) => pnMap[b] = pnMap[a]);

console.log(`Happiest bands: ${pnOrder.slice(0, 10)}`);
console.log(`Saddest bands: ${pnOrder.slice(-10)}`);


function merge(stats) {
  const wordMap = new Map();

  stats.forEach((item) => {
    if (!wordMap.get(item.word)) {
      wordMap.set(item.word, item.count);
    } else {
      wordMap.set(item.word, wordMap.get(item.word) + item.count);
    }
  });

  return Array.from(wordMap.keys())
    .filter((word) => wordMap.get(word) > 1)
    .sort((a, b) => wordMap.get(b) - wordMap.get(a))
    .map((word) => ({
      word,
      count: wordMap.get(word)
    }));
}


function analysis(stat, band) {
  console.log(`Band: ${band}`);

  const noun = stat.noun.slice(0, 10).map((item) => item.word);
  const adj = stat.adj.slice(0, 10).map((item) => item.word);
  const adv = stat.adv.slice(0, 10).map((item) => item.word);
  const verb = stat.verb.slice(0, 10).map((item) => item.word);

  const emotions = {
    positive: 0,
    negative: 0,
    count: 0
  };

  [...stat.noun, ...stat.adj, ...stat.adv, ...stat.verb].forEach((item) => {
    if (emotion.hasOwnProperty(item.word)) {
      emotions.positive += emotion[ item.word ].positive * item.count;
      emotions.negative += emotion[ item.word ].negative * item.count;
      emotions.count += item.count;
    }
  });

  const result = {
    noun,
    adj,
    adv,
    verb,
    positive: (emotions.positive / emotions.count * 100).toFixed(2),
    negative: (emotions.negative / emotions.count * 100).toFixed(2)
  };

  fs.writeFileSync(path.join(ANALYSIS_PATH, band), JSON.stringify(result));

  return result;
}
