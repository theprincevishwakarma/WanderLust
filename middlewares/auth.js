const ExpressError = require("../utils/ExpressError");

// check user is Logged in
exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    }
    req.flash("error", "You must be logged in to continue!");
    return res.redirect("/auth/login");
  }
  next();
};

exports.isProfileOwner = (req, res, next) => {
  if (req.params.username != req.user.username) {
    return next(new ExpressError(404, "Page Not Found!"));
  }
  next();
};

// save the url for redirect after login
exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
