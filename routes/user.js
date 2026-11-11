const express = require("express");
const router = express.Router();
const wrapAasync = require("../utils/wrapAsync");

const userController = require("../controllers/users");

router
  .route("/")
  .get(userController.renderUserProfile)
  .put(wrapAasync(userController.updateUser))
  .patch(wrapAasync(userController.updatePassword))
  .delete(wrapAasync(userController.destroyUser));

router.get("/edit", userController.renderEditForm);
router.get("/newpassword", wrapAasync(userController.renderChangePasswordForm));

router.get("/listings", wrapAasync(userController.renderAllListings));

module.exports = router;
