const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const { successResponse } = require("../helper/responseHelper");
const { isAdmin } = require("../middleware/adminPermission");

router.use(isAdmin);

router.get("/users", async (req, res, next) => {
  try {
    let users = await User.find({}, "username email photo isAdmin isBanned");
    res
      .status(200)
      .json(successResponse({ data: { users }, result: users?.length }));
  } catch (error) {
    next(error);
  }
});

router.patch("/user/ban/:username", async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { username: req.params.username },
      { isBanned: true }
    );

    res
      .status(200)
      .json(successResponse({ message: "User successfully banned!" }));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
