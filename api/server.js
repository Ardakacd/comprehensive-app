const express = require("express");
const app = express();
const server = require("http").createServer(app);
const chalk = require("chalk");
require("dotenv").config();
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const adminRouter = require("./routes/adminRoutes");
const { failResponse } = require("./helper/responseHelper");
require("./database");

app.use(express.json());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .send(failResponse({ message: err.message }));
  }
  console.log(chalk.red(err));
  res.status(400).send("Something broke!");
});

server.listen(3001, () => {
  console.log(chalk.yellow.bold("Connected to server!"));
});
