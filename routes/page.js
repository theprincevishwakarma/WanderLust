const express = require("express");
const router = express.Router();

const controllers = require("../controllers/page");

router.get("/privacy", controllers.privacyPage);

router.get("/terms", controllers.termsPage);

module.exports = router;
