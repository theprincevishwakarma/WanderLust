const express = require("express");
const router = express.Router();

const { isLoggedIn, isProfileOwner } = require("../middlewares");

router.use(require("./seo"));
router.use("/staynest", require("./page"));
router.use("/auth", require("./auth"));
router.use("/listings", require("./listing"));

router.use("/book/stays", require("./booking"));

router.use("/listings/:id/reviews", require("./review"));

router.use("/:username", isLoggedIn, isProfileOwner, require("./user"));

module.exports = router;
