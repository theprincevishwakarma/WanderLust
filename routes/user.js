const express = require("express");
const router = express.Router();
const wrapAasync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl, validateUser } = require("../middleware");

const userController = require("../controllers/users");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(validateUser, wrapAasync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login,
  );

router.post("/logout", isLoggedIn, userController.logout);
router.get("/:username/profile", isLoggedIn, userController.renderUserProfile);

module.exports = router;
