const { sign, verify, decode } = require('jsonwebtoken');

module.exports = {
    generate: subject => sign({}, process.env.JWT_SECRET, {subject}),
    verify : token => verify(token, process.env.JWT_SECRET),
    decode
};