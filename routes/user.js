const express = require("express");
const router = express.Router();
const wrapAasync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users");

router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAasync(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login,
);

router.post("/logout", isLoggedIn, userController.logout);

module.exports = router;
