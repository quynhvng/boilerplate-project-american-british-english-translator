// todo case matching?

const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

let britishToAmericanSpelling;
for (w in americanToBritishSpelling) {
  if (americanToBritishSpelling.hasOwnProperty(w)) {
    britishToAmericanSpelling[americanToBritishSpelling[w]] = w;
  }
}
const britishToAmericanTitles;
for (w in americanToBritishTitles) {
  if (americanToBritishTitles.hasOwnProperty(w)) {
    britishToAmericanTitles[americanToBritishTitles[w]] = w;
  }
}

class Translator {
  aToB(str) {
    console.time('a to b');
    let res = str.slice(0).trim().toLowerCase();
    // translated american only words and titles
    const dict = {...americanOnly, ...americanToBritishTitles};
    for (const w in dict) {
      if (res.includes(w)) {
        res = res.replaceAll(w, dict);
      }
    }
    // american spelling to british
    let words = res.split(/\b/);
    words = words.map(w => americanToBritishSpelling[w] || w);
    console.timeEnd('a to b');
    return words.join('');
  }

  bToA(str) {
    console.time('b to a');
    let res = str.slice(0).trim().toLowerCase();
    // translated british only words
    for (const w in britishOnly) {
      if (res.includes(w)) {
        res = res.replaceAll(w, britishOnly[w]);
      }
    }
    // american spelling and titles to british
    let words = res.split(/\b/);
    const dict = {...britishToAmericanSpelling, ...britishToAmericanTitles};
    words = words.map(w => dict[w] || w);
    console.timeEnd('b to a');
    return words.join('');
  }
}

module.exports = Translator;