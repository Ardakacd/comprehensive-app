const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const mongoose = require("mongoose");
const jwtHelper = require("../helper/jwtHelper");
const MongoSaveError = require("../errors/mongoSaveError");
const { successResponse } = require("../helper/responseHelper");
const NotFoundError = require("../errors/notFoundError");
const checkPassword = require("../helper/passwordHelper");

router.get("/me", (req, res, next) => {
  try {
    const user = new User(req.body);
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  delete req.body.id;
  delete req.body._id;
  delete req.body.isAdmin;
  delete req.body.isBanned;
  try {
    let userId = mongoose.Types.ObjectId();
    req.body._id = userId;

    let token = await jwtHelper.generateToken(userId);

    let user = new User(req.body);

    user.save(function (err) {
      if (err) {
        console.log(err);
        if (
          err.name == "MongoServerError" &&
          err.message.startsWith("E11000 duplicate key")
        ) {
          let key = err.message.split("{")[1].split(":")[0].trim();
          err.message = `${key} is taken`;
        } else if (err.name == "ValidationError") {
          err.message = err.message.replace("User validation failed: ", "");
        }
        return next(new MongoSaveError(err.message));
      }
      res.status(201).json(
        successResponse({
          data: { user, token },
          message: "You are registered!",
        })
      );
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    let user = await User.findOne(
      { email: req.body.email },
      "username email photo password"
    ).exec();
    if (!user) {
      return next(new NotFoundError("User is not found!"));
    }
    if (!(await checkPassword(req.body.password, user.password))) {
      let error = new Error("Password matching error");
      error.statusCode = 400;
      return next(error);
    }

    let token = await jwtHelper.generateToken(user._id);

    user.password = undefined;

    res.status(200).json(
      successResponse({
        data: { user, token },
        message: "You are logged in!",
      })
    );
  } catch (error) {
    next(error);
  }
});

router.patch("/update/:id", async (req, res, next) => {
  delete req.body.id;
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return next(new NotFoundError("User is not found!"));
    }

    Object.keys(req.body).forEach((key) => {
      if (key in user) {
        user[key] = req.body[key];
      }
    });

    user.save(function (err) {
      if (err) {
        console.log(err);
        if (
          err.name == "MongoServerError" &&
          err.message.startsWith("E11000 duplicate key")
        ) {
          let key = err.message.split("{")[1].split(":")[0].trim();
          err.message = `${key} is taken`;
        } else if (err.name == "ValidationError") {
          err.message = err.message.replace("User validation failed: ", "");
        }
        return next(new MongoSaveError(err.message));
      }
      res.status(200).json(
        successResponse({
          data: user,
          message: "Successfully updated",
        })
      );
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
