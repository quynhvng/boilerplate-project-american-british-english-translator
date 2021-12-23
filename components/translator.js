// todo case matching?

const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

let britishToAmericanSpelling = {};
for (const w in americanToBritishSpelling) {
  if (americanToBritishSpelling.hasOwnProperty(w)) {
    britishToAmericanSpelling[americanToBritishSpelling[w]] = w;
  }
}
let britishToAmericanTitles = {};
for (const w in americanToBritishTitles) {
  if (americanToBritishTitles.hasOwnProperty(w)) {
    britishToAmericanTitles[americanToBritishTitles[w]] = w;
  }
}

const dicts = {
  aToB: {
    nonspelling: {...americanOnly, ...americanToBritishTitles},
    spelling: americanToBritishSpelling
  },
  bToA: {
    nonspelling: {...britishOnly, ...britishToAmericanTitles},
    spelling: britishToAmericanSpelling
  }
}

class Translator {
  constructor(dict) {
    this.dict = dicts[dict];
  }
  
  translate(str) {
    console.time('translate');
    let res = str.trim();
    // translated specific words and titles
    for (const w in this.dict.nonspelling) {
      if (res.includes(w)) {
        res = res.replace(new RegExp(w, 'gi'), this.dict.nonspelling[w]);
      }
    }
    // convert spelling
    let words = res.split(/\b/);
    res = words.map(w => this.dict.spelling[w] || w).join('');
    console.timeEnd('translate');
    return res;
  }
}

module.exports = Translator;