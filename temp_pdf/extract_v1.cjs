const fs = require('fs');
const pdf = require('pdf-parse');

async function run() {
    try {
        let dataBuffer = fs.readFileSync('../kvkk.pdf');
        const data = await pdf(dataBuffer);
        fs.writeFileSync('../kvkk_clean_v1.txt', data.text, 'utf-8');
        console.log("Success: kvkk_clean_v1.txt created.");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
