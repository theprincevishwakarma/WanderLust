const User = require("../models/user");
const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup", { showSearch: false });
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password, firstName, lastName } = req.body.user;
    let name = { firstName, lastName };
    const newUser = new User({ email, username, name });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to StayNest!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./users/login", { showSearch: false });
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to StayNest!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};

module.exports.renderUserProfile = async (req, res) => {
  res.render("./users/profile", { showSearch: false });
};

module.exports.destroyUser = async (req, res) => {
  let { currUser } = res.locals;
  await Listing.deleteMany({ owner: currUser._id });
  await Review.deleteMany({ author: currUser._id });
  await User.findByIdAndDelete(currUser._id);
  res.redirect("/listings");
};
