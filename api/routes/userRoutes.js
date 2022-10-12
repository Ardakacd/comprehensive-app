const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const mongoose = require("mongoose");
const jwtHelper = require("../helper/jwtHelper");
const MongoSaveError = require("../errors/mongoSaveError");
const { successResponse } = require("../helper/responseHelper");
const NotFoundError = require("../errors/notFoundError");
const checkPassword = require("../helper/passwordHelper");
const validateUser = require("../middleware/userValidation");
const multer = require("multer");
var path = require("path");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "..", "client", "public", "images")); // where to store it
  },
  filename: function (req, file, cb) {
    console.log(file);
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      var err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.code = "filetype"; // to check on file type
      err.statusCode = 400;
      return cb(err);
    } else {
      var day = new Date();
      var d = day.getDay();
      var h = day.getHours();
      var fileNamee = d + "_" + h + "_" + file.originalname;
      console.log("filename produced is: " + fileNamee);
      cb(null, fileNamee);
    }
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20971520 }, // Max file size: 20MB
});

router.get("/me", validateUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();

    res.status(200).json(
      successResponse({
        data: { user },
      })
    );
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
    console.log("Geldi");
    let userId = mongoose.Types.ObjectId();
    req.body._id = userId;

    let token = await jwtHelper.generateToken(userId);

    let user = new User(req.body);

    if (process.env.NODE_ENV == "development") {
      res.cookie("token", token, {
        secure: false,
        sameSite: "strict",
      });
    } else {
      res.cookie("token", token, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
    }

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
          data: { user },
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

    if (process.env.NODE_ENV == "development") {
      res.cookie("token", token, {
        secure: false,
        sameSite: "strict",
      });
    } else {
      res.cookie("token", token, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
    }

    res.status(200).json(
      successResponse({
        data: { user },
        message: "You are logged in!",
      })
    );
  } catch (error) {
    next(error);
  }
});

router.patch("/update/:id", upload.single("avatar"), async (req, res, next) => {
  delete req.body.id;
  try {
    console.log("Geldi");
    let user = await User.findById(req.params.id);
    if (!user) {
      return next(new NotFoundError("User is not found!"));
    }
    console.log(user);
    if (req.file?.filename) {
      user.photo = req.file?.filename;
    } else {
      let error = new Error("No image is provided");
      error.statusCode = 400;
      return next(error);
    }
    console.log(req.file.filename);
    user.save(function (err) {
      console.log(req.file.filename);
      if (err) {
        console.log(req.file.filename);
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
      console.log(req.file.filename);
      res.status(200).json(
        successResponse({
          data: { filename: req.file.filename },
          message: "Successfully updated",
        })
      );
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
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

    res.status(200).json(
      successResponse({
        message: "You are logged out!",
      })
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
