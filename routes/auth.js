const express = require("express");
const router = express.Router();
const wrapAasync = require("../utils/wrapAsync");
const passport = require("passport");
const controllers = require("../controllers/auth");

const {
  validateUser,
  saveRedirectUrl,
  isLoggedIn,
} = require("../middlewares/index");

router
  .route("/signup")
  .get(controllers.renderSignupForm)
  .post(validateUser, wrapAasync(controllers.signup));

router
  .route("/login")
  .get(controllers.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/auth/login",
      failureFlash: true,
    }),
    controllers.login,
  );

router.post("/logout", isLoggedIn, controllers.logout);

module.exports = router;
