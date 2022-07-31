const { verifyToken } = require("../helper/jwtHelper");
const User = require("../model/userModel");
const NotFoundError = require("../errors/notFoundError");
const BanError = require("../errors/banError");

const validateUser = async (req, res, next) => {
  try {
    let tokenHeader = req.headers["authorization"];
    if (!tokenHeader) {
      let error = new Error("Invalid header");
      error.statusCode = 400;
      next(error);
    }
    let token = null;
    if (tokenHeader.startsWith("Bearer ")) {
      token = tokenHeader.replace("Bearer ", "");
    } else {
      let error = new Error("Invalid header");
      error.statusCode = 400;
      next(error);
    }

    let userId = await verifyToken(token);

    let user = await User.findById(userId, "isBanned").exec();

    if (!user) {
      next(new NotFoundError("User is not found!"));
    }
    if (!user.isBanned) {
      req.user = user;
      next();
    } else {
      next(new BanError());
    }
  } catch (error) {
    next(error);
  }
};

module.exports = validateUser;
