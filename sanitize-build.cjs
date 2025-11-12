const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '_expo', 'static', 'css');
const cssFile = fs.readdirSync(cssDir).find((f) => f.endsWith('.css'));
if (cssFile) {
  const cssPath = path.join(cssDir, cssFile);
  if (!fs.readFileSync(cssPath, 'utf8').includes('overflow-y: auto !important')) {
    fs.appendFileSync(cssPath, '\nbody { overflow-y: auto !important; }');
  }
}

const jsDir = path.join(__dirname, '_expo', 'static', 'js', 'web');
const jsFile = fs.readdirSync(jsDir).find((f) => f.startsWith('App-') && f.endsWith('.js'));
if (!jsFile) {
  console.error('Could not locate Expo web JS bundle.');
  process.exit(1);
}
const jsPath = path.join(jsDir, jsFile);
let code = fs.readFileSync(jsPath, 'utf8');
const pattern = /const c=\{accountSid:'AC[0-9a-f]{32}',authToken:'[0-9a-f]{32}',phoneNumber:'\+?[0-9]+',messagingServiceSid:'MG[0-9a-f]{32}'\}/;
if (pattern.test(code)) {
  code = code.replace(pattern, "const c={accountSid:'',authToken:'',phoneNumber:'',messagingServiceSid:''}");
  fs.writeFileSync(jsPath, code);
  console.log('Sanitized Twilio credentials in', jsFile);
} else {
  console.log('Twilio credentials not found; bundle may already be sanitized.');
}
