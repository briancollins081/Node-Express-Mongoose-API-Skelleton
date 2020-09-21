const fs = require('fs');
const path = require('path');

exports.privateKey = fs.readFileSync(path.join(__dirname, 'keys', 'jwtRS256.key'), 'utf-8');
exports.publicKey = fs.readFileSync(path.join(__dirname, 'keys', 'jwtRS256.key.pub'), 'utf-8');
exports.loginOptions = {
    issuer: 'Andere Brian',
    audience: 'Adalabs Website Users',
    expiresIn: "24h",
    algorithm: "RS256"
};
exports.verifyOptions = {
    issuer: 'Andere Brian',
    audience: 'Adalabs Website Users',
    expiresIn: "24h",
    algorithm: ["RS256"]
}

/* https://www.csfieldguide.org.nz/en/interactives/rsa-key-generator/

// or

1.ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS512.key
**Don't add passphrase**
2.openssl rsa -in jwtRS512.key -pubout -outform PEM -out jwtRS256.key.pub
*/