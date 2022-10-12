var jwt = require("jsonwebtoken");
const util = require("node:util");
const User = require("../model/userModel");

exports.generateToken = async (id) => {
  try {
    promissedSign = util.promisify(jwt.sign);
    const token = await promissedSign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return token;
  } catch (error) {
    throw new Error("Unable to sign jwt");
  }
};

exports.verifyToken = async (token) => {
  try {
    promissedVerify = util.promisify(jwt.verify);
    const decoded = await promissedVerify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    let err = new Error("Invalid token");
    err.statusCode = 400;
    throw err;
  }
};
