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

router.use("/:id/review", ReviewRouter);

router.get("/", async (req, res, next) => {
  try {
    let count = -1;
    if (req.query) {
      let firstFilter = filterHelper.queryFilter(req.query);

      let strFilter = JSON.stringify(firstFilter);
      strFilter = strFilter.replace(/(gte|gt|lt|lte)/g, (match) => `$${match}`);

      firstFilter = JSON.parse(strFilter);

      var query = Product.find(firstFilter);

      if (req.query.sort) {
        query = query.sort(req.query.sort.split(",").join(" "));
      }

      count = await Product.where(firstFilter).countDocuments();

      if (req.query.page && req.query.limit) {
        query = query
          .skip((req.query.page - 1) * req.query.limit)
          .limit(req.query.limit);
      }
    } else {
      var query = Product.find({});
    }

    let products = await query
      .populate({ path: "owner", select: "username photo" })
      .exec();

    count = count == -1 ? products.length : count;

    res
      .status(200)
      .json(successResponse({ data: { products }, result: count }));
  } catch (error) {
    console.log(chalk.red(error.message));
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate({
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

router.post("/add", upload.single("coverPhoto"), (req, res, next) => {
  delete req.body.id;
  try {
    let newBody = null;
    console.log(req.file);
    if (req.file?.filename) {
      newBody = {
        ...req.body,
        owner: req.user._id,
        coverPhoto: req.file.filename,
      };
    } else {
      newBody = { ...req.body, owner: req.user._id };
    }

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

router.patch(
  "/update/:slug",
  upload.single("coverPhoto"),
  async (req, res, next) => {
    delete req.body.id;
    delete req.body.ownerId;
    delete req.body.owner;
    delete req.body._id;
    delete req.body.slug;
    try {
      console.log(req.file);
      if (Object.keys(req.body).includes("name")) {
        req.body.slug = slugify(req.body.name, {
          lower: true,
        });
      }
      let product = await Product.findOne({ slug: req.params.slug }).exec();

      console.log(product);

      if (product?.length == 0 || !product) {
        return next(new NotFoundError("Product not found!"));
      }

      if (!product.owner.equals(req.user._id)) {
        let error = new Error("You cannot change others product!");
        error.statusCode = 403;
        return next(error);
      }

      Object.keys(req.body).forEach((key) => {
        if (key in product) {
          product[key] = req.body[key];
        }
      });

      if (req.file?.filename) {
        product.coverPhoto = req.file?.filename;
      }

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
            err.message = err.message.replace(
              "Product validation failed: ",
              ""
            );
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
  }
);

router.delete("/delete/:slug", async (req, res, next) => {
  delete req.body.id;
  delete req.body.ownerId;
  delete req.body.owner;
  try {
    let product = await Product.findOne({ slug: req.params.slug }).exec();

    if (product?.length == 0 || !product) {
      return next(new NotFoundError("Product not found!"));
    }

    if (!product.owner.equals(req.user._id)) {
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
