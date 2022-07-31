const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../model/userModel");
const mongoose = require("mongoose");
const MongoSaveError = require("../errors/mongoSaveError");
const { successResponse } = require("../helper/responseHelper");
const NotFoundError = require("../errors/notFoundError");
const validateUser = require("../middleware/userValidation");
const Review = require("../model/reviewModel");
const chalk = require("chalk");

router.use(validateUser);

router.post("/", (req, res, next) => {
  delete req.body.id;
  delete req.body._id;

  let newBody = { ...req.body, product: req.params.id };
  let review = new Review(newBody);

  review.save(function (err) {
    if (err) {
      if (
        err.name == "MongoServerError" &&
        err.message.startsWith("E11000 duplicate key")
      ) {
        let key = err.message.split("{")[1].split(":")[0].trim();
        err.message = `${key} is taken`;
      } else if (err.name == "ValidationError") {
        if (err.message.includes("Cast to ObjectId failed")) {
          return next(new MongoSaveError("Error!"));
        }
        if (err.message.includes("Cast to Number failed")) {
          return next(new MongoSaveError("Rating should be number"));
        }
        err.message = err.message.replace("Review validation failed: ", "");
      }
      console.log(chalk.red(err));
      return next(new MongoSaveError(err.message));
    }
    res.status(201).json(
      successResponse({
        data: { review },
        message: "Review is successfully added!",
      })
    );
  });
});

router.patch("/:reviewId", async (req, res, next) => {
  delete req.body.id;
  delete req.body.user;
  delete req.body._id;
  delete req.body.product;
  try {
    let review = await Review.findOne({ _id: req.params.reviewId }).exec();

    if (review?.length == 0 || !review) {
      return next(new NotFoundError("Review not found!"));
    }

    if (!review.user.equals(req.user._id)) {
      let error = new Error("You cannot change others reviews!");
      error.statusCode = 403;
      return next(error);
    }

    Object.keys(req.body).forEach((key) => {
      if (key in review) {
        review[key] = req.body[key];
      }
    });

    review.save(function (err) {
      if (err) {
        if (
          err.name == "MongoServerError" &&
          err.message.startsWith("E11000 duplicate key")
        ) {
          let key = err.message.split("{")[1].split(":")[0].trim();
          err.message = `${key} is taken`;
        } else if (err.name == "ValidationError") {
          if (err.message.includes("Cast to Number failed")) {
            return next(new MongoSaveError("Rating should be number"));
          }
          err.message = err.message.replace("Review validation failed: ", "");
        }
        return next(new MongoSaveError(err.message));
      }
      res.status(201).json(
        successResponse({
          data: { review },
          message: "Review is successfully updated!",
        })
      );
    });
  } catch (error) {
    console.log(chalk.red(error.message));
    next(error);
  }
});

router.delete("/:reviewId", async (req, res, next) => {
  delete req.body.id;
  delete req.body.ownerId;
  try {
    let review = await Review.findOne({ _id: req.params.reviewId }).exec();

    if (review?.length == 0 || !review) {
      return next(new NotFoundError("Review not found!"));
    }
    if (!review.user.equals(req.user._id)) {
      let error = new Error("You cannot change others reviews!");
      error.statusCode = 403;
      return next(error);
    }
    await Review.deleteOne({ _id: req.params.reviewId });

    res.status(204).json();
  } catch (error) {
    console.log(chalk.red(error.message));
    next(error);
  }
});

module.exports = router;
