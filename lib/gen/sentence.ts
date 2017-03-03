'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as pos from 'pos';
import * as franc from 'franc';

import { RAW_TEXT_PATH, TAGGED_TEXT_PATH } from '../constants';

const lemma = require('../lemma.json');

const WHITE_LIST = [
  't', 'm', 're', 'll', 've', 'don', 'doesn',
  'much',
  'one',
  'be', 'have', 'do', 'take', 'get', 'make', 'let'
];

// get samples
// fs.readdir(RAW_TEXT_PATH, (error, bands) => {
//   const BAND_RATIO = 0.1;
//   const SONG_RATIO = 0.1;
//   const songs: string[] = [];
//
//   bands.forEach((band) => {
//     if (!/^\w/.test(band) || Math.random() > BAND_RATIO) { return; }
//
//     const bandPath = path.join(RAW_TEXT_PATH, band);
//     const files = fs.readdirSync(bandPath);
//
//     if (!files.length) {
//       console.error(`no data: ${band}`);
//       return;
//     }
//
//     files.forEach((file) => {
//       if (Math.random() > SONG_RATIO) return;
//
//       const text = fs.readFileSync(path.join(bandPath, file), 'UTF-8');
//
//       if (!text) {
//         console.error(`no text: ${file}`);
//         return;
//       }
//
//       // Filter out non-English bands
//       if (franc(text) !== 'eng') {
//         return;
//       }
//
//       songs.push(text);
//     });
//   });
//
//   fs.writeFile(path.join(__dirname, '../../gen-data/sentences-raw.txt'), songs.join('\n'));
// });

// Tag sentence by sentence
// fs.readFile(path.join(__dirname, '../../gen-data/sentences-raw.txt'), 'UTF-8', (error, data) => {
//   const tagger = new pos.Tagger();
//
//   const sentences: string[] = data.split('\n').filter(line => line.trim().length);
//
//   const tagResults = sentences.map((line) => {
//     const words = new pos.Lexer().lex(line);
//     return tagger.tag(words);
//   });
//
//   const posSentences = tagResults.map((sentence) => {
//     return {
//       text: sentence.reduce((result, item) => result + ' ' + item[0], '').trim(),
//       pos: sentence.reduce((result, item) => result + ' ' + item[1], '').trim()
//     };
//   });
//
//   console.log(posSentences);
//
//   fs.writeFile(path.join(__dirname, '../../gen-data/sentences-tagged.txt'), JSON.stringify(posSentences));
// });

// Pick sentence frames
fs.readFile(path.join(__dirname, '../../gen-data/sentences-tagged.txt'), 'UTF-8', (error, data) => {
  const sentences: any[] = JSON.parse(data);
  const total = sentences.length;
  const selectedIndex: number[] = [];

  const lineCount = 20;
  // const theme = 'love';
  // const loveWords = JSON.parse(fs.readFileSync(path.join(__dirname, `../../gen-data/${theme}.txt`), 'UTF-8'));

  for (let i = 0; i < lineCount; i += 1) {
    const index = Math.floor(Math.random() * total);

    if (selectedIndex.indexOf(index) === -1) {
      selectedIndex.push(index);
    }
  }

  const selected: any = [];

  for (let i = 0; i < lineCount; i += 1) {
    selected.push(sentences[selectedIndex[i]]);
  }

  // const POS = ['NN', 'NNS', 'JJ', 'JJR', 'JJS'];

  // selected.forEach((line, i, array) => {
  //   const words = line.text.split(/\s/);
  //
  //   line.pos.split(/\s/).forEach((p, index) => {
  //     console.log(p);
  //     if (
  //       (POS.indexOf(p) !== -1) &&
  //       words[index] &&
  //       (WHITE_LIST.indexOf(lemma[words[index].toLowerCase()] ? lemma[words[index].toLowerCase()] : words[index]) === -1)
  //     ) {
  //       words[index] = loveWords[p][Math.floor(Math.random() * loveWords[p].length)];
  //     }
  //   });
  //
  //   array[i].gen = words.join(' ').trim();
  // });

  console.log(selected.map(item => item.text));
});
