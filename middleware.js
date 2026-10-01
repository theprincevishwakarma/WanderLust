module.exports.isLoggedIn = (message) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash("error", message);
      return res.redirect("/login");
    }

    next();
  };
};
