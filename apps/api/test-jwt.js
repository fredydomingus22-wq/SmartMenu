const jwt = require('jsonwebtoken');
const fs = require('fs');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlramtkeWVzZWpzc2lkeXF3cXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzODUyNzcsImV4cCI6MjA4Mzk2MTI3N30.W5xyrkspeSSuDsqGOBA8VhckJak9IzyqfJnu0-kN20s";
const secret = "2Gx9Nbp0lw+wShnUNiC//YsCbcyxL4063yRjkK4NPHHLl39p9cdnP3sAL+bhQsVJkOuEGbjRoOo5DBM6Xzu/Ww==";

let results = "";

const encodings = [
    { name: 'Raw String', val: secret },
    { name: 'Base64 Buffer', val: Buffer.from(secret, 'base64') },
    { name: 'UTF-8 Buffer', val: Buffer.from(secret, 'utf-8') }
];

encodings.forEach(enc => {
    try {
        const decoded = jwt.verify(token, enc.val, { algorithms: ['HS256'] });
        results += `✅ [${enc.name}] SUCCESS! Payload: ${JSON.stringify(decoded).substring(0, 50)}\n`;
    } catch (e) {
        results += `❌ [${enc.name}] FAILED: ${e.message}\n`;
    }
});

fs.writeFileSync('jwt-test-results.txt', results);
