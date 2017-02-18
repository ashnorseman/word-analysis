'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as pos from 'pos';
import * as franc from 'franc';

import { RAW_TEXT_PATH, TAGGED_TEXT_PATH } from './constants';

fs.readdir(RAW_TEXT_PATH, (error, bands) => {
  const nonEnglish: string[] = [];

  bands.forEach((band) => {
    if (!/^\w/.test(band)) { return; }

    const bandPath = path.join(RAW_TEXT_PATH, band);
    const files = fs.readdirSync(bandPath);

    if (!files.length) {
      console.error(`no data: ${band}`);
      return;
    }

    const tagBandPath = path.join(TAGGED_TEXT_PATH, band);

    files.forEach((file) => {
      const tagPath = path.join(tagBandPath, file);
      const text = fs.readFileSync(path.join(bandPath, file), 'UTF-8');

      if (!text) {
        console.error(`no text: ${file}`);
        return;
      }

      // Filter out non-English bands
      if (franc(text) !== 'eng') {
        console.log(`seems no English: ${file}`);
        nonEnglish.push(file);
        return;
      }

      const words = new pos.Lexer().lex(text);
      const tagger = new pos.Tagger();
      const taggedWords = tagger.tag(words);

      console.log(`tagging: ${file}`);

      if (!fs.existsSync(tagBandPath)) {
        fs.mkdirSync(tagBandPath);
      }

      fs.writeFileSync(tagPath, JSON.stringify(taggedWords));
    });
  });

  console.log(nonEnglish);
});
