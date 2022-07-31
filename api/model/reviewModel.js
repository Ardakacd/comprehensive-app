const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./userModel");
const Product = require("./productModel");

const reviewSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
      trim: true,
    },
    user: {
      type: mongoose.ObjectId,
      ref: User,
    },
    product: {
      type: mongoose.ObjectId,
      ref: Product,
    },
    rating: {
      type: Number,
      required: [true, "Price field should be filled!"],
      min: [0, "Rating should be at least 0"],
      max: [5, "Rating should be at most 5"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "username photo" });

  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
