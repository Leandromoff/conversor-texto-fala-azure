const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
assert(html.includes('<textarea'), 'Textarea element missing');
console.log('Tests passed');
