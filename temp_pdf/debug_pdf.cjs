const pdfModule = require('pdf-parse');
console.log('Keys:', Object.keys(pdfModule));
if (pdfModule.pdf) console.log('pdf is a function');
if (pdfModule.default) console.log('default is a function', typeof pdfModule.default);
