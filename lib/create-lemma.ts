'use strict';

import * as fs from 'fs';
import * as path from 'path';

const lemma: string[] = fs.readFileSync(path.join(__dirname, './lemma.txt'), 'UTF-8')
  .toLocaleLowerCase()
  .trim()
  .replace(/\r/g, '')
  .replace(/ -> \[[^\]]+]/g, '')
  .split('\n');

const result = {};

for (let i = 0; i < lemma.length; i += 1) {
  const line: string = lemma[i];

  if (!/^\s/.test(line) && /^\s/.test(lemma[i + 1])) {
    result[line] = lemma[++i].trim().split(/,\s/);
  }
}

const words = {};

Object.keys(result).forEach((lemma) => {
  result[lemma].forEach((word) => {
    words[word] = lemma;
  });
});

fs.writeFile(path.join(__dirname, './lemma.json'), JSON.stringify(words));
