import * as fs from 'fs';

fs.readFile('./gen-data/file.txt', 'UTF-8', (error, data: string) => {
  const list = JSON.parse(data);
  const result: string[] = [];

  list.forEach((item) => {
    const word = item._id;
    const count = item.count;

    for (let i = 0; i < count; i += 1) {
      result.push(word);
    }
  });

  fs.writeFile('./gen-data/file-1.txt', result.join('\n'));
});
