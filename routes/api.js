'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const aToB = new Translator('aToB');
  const bToA = new Translator('bToA');

  app.route('/api/translate')
    .post((req, res, next) => {
      const text = req.body.text;
      const locale = req.body.locale;
      if ((text && locale) === undefined) {
        res.json({ error: 'Required field(s) missing' });
        return next();
      }
      if (!text) {
        res.json({ error: 'No text to translate' });
        return next();
      }
      let translation;
      switch (locale) {
        case 'american-to-british':
          translation = aToB.translate(text);
          break;
        case 'british-to-american':
          translation = bToA(text);
          break;
        default:
          res.json({ error: 'Invalid value for locale field' });
          return next();
      }
      if (translation == text) {
        translation = 'Everything looks good to me!';
      }
      res.send({ text, translation });
    });
};
