const User = require("../models/user");
const Listing = require("../models/listing");
const Review = require("../models/review");

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
  let { username } = req.body.user;
  const existingUser = await User.findOne({
    username,
    _id: { $ne: user._id },
  });

  if (existingUser) {
    req.flash("error", "Username already exists!");
    return res.redirect(`/${user.username}/edit`);
  }

  user.set({
    ...req.body.user,
    name: {
      firstName: req.body.user.name.firstName,
      lastName: req.body.user.name.lastName,
    },
  });

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

module.exports.renderAllListings = async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id });
  if (listings.length != 0) {
    return res.render("./users/listings", { listings, showSearch: false });
  }
  req.flash("success", "Create Your StayNest!");
  res.redirect("/listings/new");
};
