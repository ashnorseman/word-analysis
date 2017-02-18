'use strict';

import * as fs from 'fs';
import * as path from 'path';

import { HTML_PATH, RAW_TEXT_PATH } from './constants';

fs.readdirSync(HTML_PATH).forEach((band) => {
  if (!/^\w/.test(band)) { return; }

  const bandTextPath: string = path.join(RAW_TEXT_PATH, band);

  if (!fs.existsSync(bandTextPath)) {
    fs.mkdirSync(bandTextPath);
  }

  const bandHTMLPath: string = path.join(HTML_PATH, band);

  fs.readdirSync(bandHTMLPath).forEach((album: string) => {
    album = album.replace('.html', '');

    const text: string = fs.readFileSync(path.join(bandHTMLPath, `${album}.html`), 'UTF-8');

    if (!text) { return; }

    // title format:
    // `<title>...AAAARRGHH... LYRICS - &quot;...aaaarrghh...&quot; (1999) demo</title>`
    const title: string = /<title>(.+?)<\/title>/.exec(text)[1];

    if (!title) {
      console.error(`No title: ${band} - ${album}`);
      return;
    }

    const realBandName: string = title.split(/\s+LYRICS/)[0]
      .replace(/\W/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const yearExec: RegExpExecArray = /\((\d+)\)/.exec(title);
    const year: string = yearExec ? yearExec[1] : '-';

    const realAlbumExec: RegExpExecArray = /(?:&quot;|")(.+)(?:&quot;|")/.exec(title);
    const realAlbumName: string = realAlbumExec
      ? realAlbumExec[1].replace(/\W/g, ' ').replace(/\s+/g, ' ').trim()
      : '-';

    // Lyrics are wrapped in:
    // `<div class="lyrics">LYRICS</div>`
    const contentExec: RegExpExecArray = /<div class="lyrics">([\s\S]+?)<div/.exec(text);

    if (!contentExec) {
      console.error(`No lyrics: ${realBandName} ${year} ${realAlbumName}`);
      return;
    }

    const content: string = contentExec[1]
      .replace(/<a [^>]+>/g, '【')
      .replace(/<\/a>/g, '】')
      .replace(/<\w+[^>]*>|<\/\w+>/g, '')   // remove html tags
      .replace(/\[[^\]]+]/g, '')            // remove remarks
      .replace(/[\r|\n]{2,}/g, '\n\n')      // max successive line-breaks: 2
      .replace(/[�‘’`´]+/g, '\'')          // use straight quotes
      .replace(/[…*“”~•|\\\/]/g, ' ')       // remove strange punctuations
      .replace(/ +[-—] +/g, ' ')            // remove unnecessary dashes
      .replace(/\s+$/g, '')                 // remove end-of-line whitespaces
      .trim();

    console.log(`writing: ${realBandName} ${year} ${realAlbumName}`);

    // Extract songs

    const titleReg: RegExp = /^【[^】]+】$/;
    const lines: string[] = content.split(/\n/);
    const songs: Map<string, string> = new Map();

    let currentTitle: string = '';
    let currentContent: string = '';

    lines.forEach((line: string) => {
      if (titleReg.test(line)) {

        // save last song
        if (currentTitle && currentContent.trim()) {
          songs.set(currentTitle, currentContent.trim());
        }

        currentTitle = line.slice(1, line.length - 1);
        currentContent = '';
      } else {
        currentContent += (line + '\n');
      }
    });

    if (currentTitle && currentContent.trim()) {
      songs.set(currentTitle, currentContent.trim());
    }

    for (let title of songs.keys()) {
      fs.writeFileSync(
        path.join(bandTextPath, `[${realBandName}] [${year}] [${realAlbumName}] ${title}.txt`),
        songs.get(title),
      );
    }
  });
});
