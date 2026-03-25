const fs = require('fs');
const pdf = require('pdf-parse');

// Path to the renamed pdf
let dataBuffer = fs.readFileSync('../kvkk.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
