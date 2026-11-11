const express = require("express");
const router = express.Router();

router.use(require("./seo"));
router.use("/staynest", require("./page"));
router.use("/auth", require("./auth"));
router.use("/listings", require("./listing"));

router.use("/:username", require("./user"));

router.use("/book/stays", require("./booking"));

router.use("/listings/:id/reviews", require("./review"));

module.exports = router;
