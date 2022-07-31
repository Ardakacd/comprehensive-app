const express = require("express");
const router = express.Router();
const Product = require("../model/productModel");
const filterHelper = require("../helper/filterHelper");
const { successResponse } = require("../helper/responseHelper");
const chalk = require("chalk");
const slugify = require("slugify");
const NotFoundError = require("../errors/notFoundError");
const MongoSaveError = require("../errors/mongoSaveError");
const validateUser = require("../middleware/userValidation");
const ReviewRouter = require("./reviewRoutes");

router.use("/:id/review", ReviewRouter);

router.get("/", async (req, res, next) => {
  try {
    if (req.query) {
      let firstFilter = filterHelper.queryFilter(req.query);

      let strFilter = JSON.stringify(firstFilter);
      strFilter = strFilter.replace(/(gte|gt|lt|lte)/g, (match) => `$${match}`);

      firstFilter = JSON.parse(strFilter);

      var query = Product.find(firstFilter);

      if (req.query.sort) {
        query = query.sort(req.query.sort.split(",").join(" "));
      }

      if (req.query.page && req.query.limit) {
        query = query
          .skip((req.query.page - 1) * req.query.limit)
          .limit(req.query.limit);
      }
    } else {
      var query = Product.find({});
    }

    let products = await query.exec();

    res
      .status(200)
      .json(successResponse({ data: { products }, result: products?.length }));
  } catch (error) {
    console.log(chalk.red(error.message));
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const product = await Product.find({ slug: req.params.slug }).populate({
      path: "reviews",
      select: "title description user rating -product",
    });

    if (product?.length == 0 || !product) {
      return next(new NotFoundError("Product not found!"));
    }

    res.status(200).json({ data: { product } });
  } catch (error) {
    console.log(chalk.red(error.message));
    next(error);
  }
});

router.use(validateUser);

router.post("/add", (req, res, next) => {
  delete req.body.id;
  try {
    let newBody = { ...req.body, ownerId: req.user._id };
    const product = new Product(newBody);

    product.save(function (err) {
      if (err) {
        if (
          err.name == "MongoServerError" &&
          err.message.startsWith("E11000 duplicate key")
        ) {
          let key = err.message.split("{")[1].split(":")[0].trim();
          err.message = `${key} is taken`;
        } else if (err.name == "ValidationError") {
          if (err.message.includes("Cast to Number failed")) {
            return next(new MongoSaveError("Price should be number"));
          }
          err.message = err.message.replace("Product validation failed: ", "");
        }
        return next(new MongoSaveError(err.message));
      }
      res.status(201).json(
        successResponse({
          data: { product },
          message: "Product is successfully added!",
        })
      );
    });
  } catch (error) {
    console.log(chalk.red(error.message));
    next(error);
  }
});

router.patch("/update/:slug", async (req, res, next) => {
  delete req.body.id;
  delete req.body.ownerId;
  delete req.body._id;
  delete req.body.slug;
  try {
    if (Object.keys(req.body).includes("name")) {
      req.body.slug = slugify(req.body.name, {
        lower: true,
      });
    }
    let product = await Product.findOne({ slug: req.params.slug }).exec();

    if (product?.length == 0 || !product) {
      return next(new NotFoundError("Product not found!"));
    }

    if (!product.ownerId.equals(req.user._id)) {
      let error = new Error("You cannot change others product!");
      error.statusCode = 403;
      return next(error);
    }

    Object.keys(req.body).forEach((key) => {
      if (key in product) {
        product[key] = req.body[key];
      }
    });

    product.save(function (err) {
      if (err) {
        if (
          err.name == "MongoServerError" &&
          err.message.startsWith("E11000 duplicate key")
        ) {
          let key = err.message.split("{")[1].split(":")[0].trim();
          err.message = `${key} is taken`;
        } else if (err.name == "ValidationError") {
          if (err.message.includes("Cast to Number failed")) {
            return next(new MongoSaveError("Price should be number"));
          }
          err.message = err.message.replace("Product validation failed: ", "");
        }
        return next(new MongoSaveError(err.message));
      }
      res.status(201).json(
        successResponse({
          data: { product },
          message: "Product is successfully updated!",
        })
      );
    });
  } catch (error) {
    console.log(chalk.red(error.message));
    next(error);
  }
});

router.delete("/delete/:slug", async (req, res, next) => {
  delete req.body.id;
  delete req.body.ownerId;
  try {
    let product = await Product.findOne({ slug: req.params.slug }).exec();

    if (product?.length == 0 || !product) {
      return next(new NotFoundError("Product not found!"));
    }

    if (!product.ownerId.equals(req.user._id)) {
      let error = new Error("You cannot delete others product!");
      error.statusCode = 403;
      next(error);
    }

    await Product.deleteOne({ slug: req.params.slug });

    res.status(204).json();
  } catch (error) {
    console.log(chalk.red(error.message));
    next(error);
  }
});

module.exports = router;
