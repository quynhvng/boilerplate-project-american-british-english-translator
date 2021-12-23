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
  a2b: {
    unique: americanOnly, 
    title: americanToBritishTitles,
    spelling: americanToBritishSpelling,
    timeformat: {
      regex: new RegExp('(\\d{1,2}):(\\d{1,2})', 'g'),
      to: '.' 
    }
  },
  b2a: {
    unique: britishOnly,
    title: britishToAmericanTitles,
    spelling: britishToAmericanSpelling,
    timeformat: {
      regex: new RegExp('(\\d{1,2})\\.(\\d{1,2})', 'g'),
      to: ':' 
    }
  }
}

function highlight(str) {
  if (!str) return str;
  return `<span class="highlight">${str}</span>`;
}

class Translator {
  constructor(locale) {
    this.locale = locale;
    this.dict = dicts[locale];
  }

  translate(str) {
    //console.time('test');
    let res = str.trim();
    const lowerCase = res.toLowerCase();
    // translated unique words
    for (const w in this.dict.unique) {
      if (lowerCase.includes(w)) {
        res = res.replace(new RegExp(`\\b${w}\\b`, 'gi'), highlight(this.dict.unique[w]));
      }
    }
    // translated titles
    for (const w in this.dict.title) {
      if (lowerCase.includes(w)) {
        let regexStr = `\\b${w}\\b`;
        if (this.locale = 'a2b') {
          regexStr = regexStr.replace('.\\b', '\\.');
        }
        const translated = this.dict.title[w].replace(/^./, match => match.toUpperCase());
        res = res.replace(new RegExp(regexStr, 'gi'), highlight(translated));
      }
    }
    // convert spelling
    let words = res.split(/\b/).map(w => {
      const translated = this.dict.spelling[w.toLowerCase()];
      return (translated) ? highlight(translated) : w;
    })
    res = words.join('');
    // convert time format
    res = res.replace(this.dict.timeformat.regex, (match, p1, p2) => {
      return highlight([p1, this.dict.timeformat.to, p2].join(''));
    });
    //console.timeEnd('test');
    return res;
  }
}

module.exports = Translator;