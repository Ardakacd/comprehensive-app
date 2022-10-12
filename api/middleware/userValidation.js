const { verifyToken } = require("../helper/jwtHelper");
const User = require("../model/userModel");
const NotFoundError = require("../errors/notFoundError");
const BanError = require("../errors/banError");

const validateUser = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    let userId = await verifyToken(token);

    let user = await User.findById(userId, "isBanned").exec();

    if (!user) {
      clearCookie(res);
      return next(new NotFoundError("User is not found!"));
    }
    if (!user.isBanned) {
      req.user = user;
      return next();
    } else {
      clearCookie(res);
      return next(new BanError());
    }
  } catch (error) {
    clearCookie(res);
    return next(error);
  }
};

const clearCookie = (res) => {
  if (process.env.NODE_ENV == "development") {
    res.clearCookie("token", {
      secure: false,
      sameSite: "strict",
    });
  } else {
    res.clearCookie("token", {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
  }
};

module.exports = validateUser;
