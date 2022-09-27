const bcryptjs = require("bcryptjs");

function encrypt(password) {
  const salt = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(password, salt);
}

function decrypt(password, hashedPassword) {
  return bcryptjs.compareSync(password, hashedPassword);
}

module.exports = {
  encrypt,
  decrypt,
};
