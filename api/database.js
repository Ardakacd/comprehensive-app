const mongoose = require("mongoose");
const chalk = require("chalk");

main()
  .then(() => {
    console.log(chalk.yellow.bold("Connected to database!"));
  })
  .catch((err) =>
    console.log(chalk.red.bold("Connection to databse is failed!"))
  );

async function main() {
  await mongoose.connect("mongodb://localhost:27017/comprehensive");
}
