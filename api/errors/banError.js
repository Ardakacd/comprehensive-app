class BanError extends Error {
  constructor() {
    super("You are banned");
    this.statusCode = 403;
  }
}

module.exports = BanError;
