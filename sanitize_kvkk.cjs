const fs = require('fs');
try {
    const b = fs.readFileSync('kvkk_v3.txt');
    // It might be UTF-8 but PowerShell redirected it, or it's actually some other encoding.
    // pdf-parse output is usually UTF-8. 
    // If kvkk_v3 is from PowerShell redirect `> `, it's likely UTF-16LE in Windows PS 5.1
    // or UTF-8 without BOM in PS Core.
    let content = b.toString('utf8');
    if (b[0] === 0xFF && b[1] === 0xFE) { // UTF-16LE BOM
        content = b.toString('utf16le');
    }
    fs.writeFileSync('kvkk_clean.txt', content, 'utf8');
} catch(e) {
    console.error(e);
}
