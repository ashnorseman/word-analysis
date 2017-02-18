'use strict';

import * as fs from 'fs';
import * as path from 'path';

const lemma = require('./lemma.json');

fs.readFile(path.join(__dirname, './emotion.txt'), 'UTF-8', (error, data: string) => {
  const lines: string[] = data.trim().split('\r\n');
  const wordMap = {};

  lines.forEach((line) => {
    const emotion = line.split('\t');
    const words = emotion[2].split(/\s+/);

    words.forEach((word) => {
      if (lemma[word]) {
        word = lemma[word];
      }

      if (!wordMap[word]) {
        wordMap[word] = {
          positive: [+emotion[0]],
          negative:[+emotion[1]]
        };
      } else {
        wordMap[word].positive.push(+emotion[0]);
        wordMap[word].negative.push(+emotion[1]);
      }
    });
  });

  const result = {};

  Object.keys(wordMap).forEach((word) => {
    result[word] = {
      positive: wordMap[word].positive.reduce((a, b) => a + b, 0) / wordMap[word].positive.length,
      negative: wordMap[word].negative.reduce((a, b) => a + b, 0) / wordMap[word].negative.length
    }
  });

  fs.writeFile(path.join(__dirname, './emotion.json'), JSON.stringify(result));
});
