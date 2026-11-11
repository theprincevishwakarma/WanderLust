const ExpressError = require("../utils/ExpressError");

// Page Not Found
module.exports.notFound = (req, res, next) =>
  next(new ExpressError(404, "Page Not Found!"));

// Error Handler middleware
module.exports.handler = (err, req, res, next) => {
  let { statusCode = 500, message = "Some Error Occurred!" } = err;
  res.status(statusCode).render("error", { message });
};
