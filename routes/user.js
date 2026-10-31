const express = require("express");
const router = express.Router();
const wrapAasync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl, validateUser } = require("../middlewares");

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
router
  .route("/:username")
  .get(isLoggedIn, userController.renderUserProfile)
  .put(isLoggedIn, wrapAasync(userController.updateUser))
  .patch(isLoggedIn, wrapAasync(userController.updatePassword))
  .delete(isLoggedIn, wrapAasync(userController.destroyUser));

router.get("/:username/edit", isLoggedIn, userController.renderEditForm);
router.get(
  "/:username/newpassword",
  isLoggedIn,
  wrapAasync(userController.renderChangePasswordForm),
);

router.get(
  "/:username/listings",
  isLoggedIn,
  wrapAasync(userController.renderAllListings),
);

module.exports = router;
