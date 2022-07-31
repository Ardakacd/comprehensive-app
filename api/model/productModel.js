const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name should be filled!"],
      trim: true,
      minLength: [4, "Product name should contain at least 4 character!"],
      unique: [true, "Name is a unique field!"],
    },
    slug: {
      type: String,
      unique: [true, "Slug is a unique field!"],
    },
    ownerId: {
      type: mongoose.ObjectId,
      required: [true, "Product should have an owner!"],
    },
    price: {
      type: Number,
      required: [true, "Price field should be filled!"],
      min: [1, "Price of a product should be at least 1$"],
    },
    coverPhoto: {
      type: String,
      required: [true, "Photo should have cover photo!"],
    },
    albumPhotos: { type: [String] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true },
  }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });

  next();
});

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
