const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAasync = require("../utils/wrapAsync");

// SignUp page
router.get("/signup", (req, res) => {
  res.render("./users/signup");
});

router.post(
  "/signup",
  wrapAasync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.flash("success", "Welcome to StayNest!");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }),
);

module.exports = router;
