const jwt = require("jsonwebtoken");

function sign(user) {
  return jwt.sign(user, process.env.JWT_SECRET);
}

function decode(tokenSign) {
  return jwt.verify(tokenSign, process.env.JWT_SECRET);
}

module.exports = {
  sign,
  decode,
};
