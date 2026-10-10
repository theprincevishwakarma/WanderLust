const User = require("../models/user");
const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup", { showSearch: false });
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password, name, phoneNo, location } = req.body.user;
    const newUser = new User({ email, username, name, phoneNo, location });
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

module.exports.login = (req, res) => {
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

module.exports.renderUserProfile = (req, res) => {
  res.render("./users/profile", { showSearch: false });
};

module.exports.destroyUser = async (req, res) => {
  let { currUser } = res.locals;
  await Listing.deleteMany({ owner: currUser._id });
  await Review.deleteMany({ author: currUser._id });
  await User.findByIdAndDelete(currUser._id);
  res.redirect("/listings");
};

module.exports.renderEditForm = (req, res) => {
  res.render("./users/edit");
};

module.exports.updateUser = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name.firstName = req.body.user.name.firstName;
  user.name.lastName = req.body.user.name.lastName;
  user.email = req.body.user.email;
  user.location = req.body.user.location;
  user.phoneNo = req.body.user.phoneNo;
  user.username = req.body.user.username;

  await user.save();

  req.login(user, (err) => {
    if (err) return next(err);
    req.flash("success", "Information update successfully!");
    res.redirect(`/${user.username}`);
  });
};

module.exports.renderChangePasswordForm = (req, res) => {
  res.render("./users/newpassword", { showSearch: false });
};

module.exports.updatePassword = async (req, res) => {
  let { oldpassword, newpassword, newpasswordconfirm } = req.body;

  if (!(newpassword === newpasswordconfirm)) {
    req.flash("error", "Confirm password does not match!");
    return res.redirect(`/${req.user.username}/newpassword`);
  }

  try {
    await req.user.changePassword(oldpassword, newpasswordconfirm);

    req.flash("success", "Password changed successfully!");
    res.redirect(`/${req.user.username}`);
  } catch (err) {
    req.flash("error", "Old password is incorrect!");
    res.redirect(`/${req.user.username}/newpassword`);
  }
};
