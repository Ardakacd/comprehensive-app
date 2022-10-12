const { verifyToken } = require("../helper/jwtHelper");
const User = require("../model/userModel");
const NotFoundError = require("../errors/notFoundError");
const PermissionError = require("../errors/permissionError");

exports.isAdmin = async (req, res, next) => {
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

    let user = await User.findById(userId, "isAdmin").exec();

    if (!user) {
      next(new NotFoundError("User is not found!"));
    }
    if (user.isAdmin) {
      next();
    } else {
      next(new PermissionError());
    }
  } catch (error) {
    next(error);
  }
};
