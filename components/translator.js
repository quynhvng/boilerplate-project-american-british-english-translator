const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')
const britishToAmericanSpelling = reverseObj(americanToBritishSpelling);
const britishToAmericanTitles = reverseObj(americanToBritishTitles);

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

function reverseObj(obj) {
    let res = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            res[obj[key]] = key;
        }
    }
    return res;
}

function highlight(str) {
    if (!str || str == '') return str;
    return `<span class="highlight">${str}</span>`;
}

class Translator {
    constructor(locale) {
        this.locale = locale;
        this.dict = dicts[locale];
    }

    translate(str) {
        let res = str.trim();
        const lowerCase = res.toLowerCase();
        
        // convert title
        let words = res.split(' ').map(w => {
            let translated = this.dict.title[w.toLowerCase()];
            return (translated) ? highlight(translated[0].toUpperCase()+translated.slice(1)) : w;
        })
        res = words.join(' ');
      
        // convert spelling
        words = res.split(/\b/).map(w => {
            let translated = this.dict.spelling[w.toLowerCase()];
            return (translated) ? highlight(translated) : w;
        })
        res = words.join('');
        
        // convert time format
        res = res.replace(this.dict.timeformat.regex, (match, p1, p2) => {
            return highlight([p1, this.dict.timeformat.to, p2].join(''));
        });

        // translated unique words
        for (const w in this.dict.unique) {
          if (lowerCase.includes(w)) {
            res = res.replace(new RegExp(`\\b${w}\\b`, 'gi'), highlight(this.dict.unique[w]));
          }
        }
        
        return res;
    }
}

module.exports = Translator;
