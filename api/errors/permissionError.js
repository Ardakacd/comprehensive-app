class PermissionError extends Error {
  constructor() {
    super("You do not have enough permission!");
    this.statusCode = 403;
  }
}

module.exports = PermissionError;
