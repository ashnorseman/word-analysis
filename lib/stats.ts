'use strict';

import * as fs from 'fs';
import * as path from 'path';

import { DATA_PATH } from './constants';

const emotions = require('./emotion.json');

const adj: any[] = JSON.parse(fs.readFileSync(path.join(DATA_PATH, 'all-adj.txt'), 'UTF-8'));
const adv: any[] = JSON.parse(fs.readFileSync(path.join(DATA_PATH, 'all-adv.txt'), 'UTF-8'));
const noun: any[] = JSON.parse(fs.readFileSync(path.join(DATA_PATH, 'all-noun.txt'), 'UTF-8'));
const verb: any[] = JSON.parse(fs.readFileSync(path.join(DATA_PATH, 'all-verb.txt'), 'UTF-8'));

const allWords = [...adj, ...adv, ...noun, ...verb];

const total = allWords.reduce((sum, item) => {
  return sum + item.count;
}, 0);

console.log(`Total words: ${total}`);

console.log(`Favourite nouns: ${noun.slice(0, 200).map((item) => `${item.word}: ${item.count}`).join(', ')}`);
console.log(`Favourite adjectives: ${adj.slice(0, 200).map((item) => `${item.word}: ${item.count}`).join(', ')}`);

const colors = ['red', 'green', 'blue', 'white', 'black', 'orange', 'yellow', 'pink', 'brown', 'beige', 'gray', 'purple', 'violet', 'maroon', 'magenta', 'turquoise'];

const seasons = ['spring', 'summer', 'autumn', 'winter'];

const directions = ['east', 'west', 'south', 'north'];

const religious = ['satan', 'jesus', 'buddha', 'allah'];

const temperature = ['cold', 'hot', 'warm'];

const days = ['yesterday', 'today', 'tomorrow'];

const animals = ['alligator', 'ant', 'bear', 'dragon', 'bee', 'bird', 'camel', 'cat', 'cheetah', 'chicken', 'chimpanzee', 'cow', 'crocodile', 'deer', 'dog', 'dolphin', 'duck', 'eagle', 'elephant', 'fish', 'fox', 'frog', 'giraffe', 'goat', 'goldfish', 'hamster', 'hippopotamus', 'horse', 'kangaroo', 'kitten', 'lion', 'lobster', 'monkey', 'octopus', 'owl', 'panda', 'pig', 'puppy', 'rabbit', 'rat', 'scorpion', 'shark', 'sheep', 'snail', 'snake', 'spider', 'squirrel', 'tiger', 'turtle', 'wolf', 'zebra'];

console.log(countList(colors));

console.log(countList(seasons));

console.log(countList(temperature));

console.log(countList(directions));

console.log(countList(religious));

console.log(countList(animals));

console.log(countList(days));

function countList(list) {
  return list.map((word) => {
    const count = allWords
      .filter((item) => item.word === word)
      .reduce((sum, item) => sum + item.count, 0);

    return `${word}\t${count}`;
  });
}

// console.log(getEmotion(noun.slice(0, 200)));
// console.log(getEmotion(adj.slice(0, 200)));
//
// function getEmotion(list) {
//   return list.filter((item) => emotions[item.word]).map((item) => ({
//     word: item.word,
//     count: item.count,
//     positive: emotions[item.word].positive,
//     negative: emotions[item.word].negative
//   }));
// }
