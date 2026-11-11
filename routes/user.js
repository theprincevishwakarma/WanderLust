const express = require("express");
const router = express.Router();
const wrapAasync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middlewares");

const userController = require("../controllers/users");

router
  .route("/")
  .get(isLoggedIn, userController.renderUserProfile)
  .put(isLoggedIn, wrapAasync(userController.updateUser))
  .patch(isLoggedIn, wrapAasync(userController.updatePassword))
  .delete(isLoggedIn, wrapAasync(userController.destroyUser));

router.get("/edit", isLoggedIn, userController.renderEditForm);
router.get(
  "/newpassword",
  isLoggedIn,
  wrapAasync(userController.renderChangePasswordForm),
);

router.get(
  "/listings",
  isLoggedIn,
  wrapAasync(userController.renderAllListings),
);

module.exports = router;
