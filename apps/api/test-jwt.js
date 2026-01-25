const jwt = require('jsonwebtoken');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

const token = process.env.TEST_JWT_TOKEN || "your-test-token-here";
const secret = process.env.JWT_SECRET;

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
