const bcrypt = require("bcrypt");
const util = require("node:util");

const checkPassword = async (currPassword, userPassword) => {
  try {
    console.log(currPassword);
    console.log(userPassword);
    let promisifiedCompare = util.promisify(bcrypt.compare);
    let result = await promisifiedCompare(currPassword, userPassword);
    console.log(result);
    return result;
  } catch (error) {
    return false;
  }
};

module.exports = checkPassword;
