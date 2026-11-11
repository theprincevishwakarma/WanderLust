module.exports = (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // SEO: Canonical URL
  res.locals.canonicalUrl = `https://staynest.bitofprince.site${req.path}`;
  next();
};
