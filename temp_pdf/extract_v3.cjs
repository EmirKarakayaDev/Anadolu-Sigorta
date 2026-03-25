const fs = require('fs');
const pdfModule = require('pdf-parse');
// Let's see if the module itself is the function or if it's in .default
const pdf = typeof pdfModule === 'function' ? pdfModule : (pdfModule.default || pdfModule);

async function run() {
    try {
        let dataBuffer = fs.readFileSync('../kvkk.pdf');
        if (typeof pdf !== 'function') {
            throw new Error('pdf is still NOT a function. type: ' + typeof pdf);
        }
        const data = await pdf(dataBuffer);
        fs.writeFileSync('../kvkk_clean_v3.txt', data.text, 'utf-8');
        console.log("Success: kvkk_clean_v3.txt created.");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
