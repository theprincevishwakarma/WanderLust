const express = require("express");
const router = express.Router();

const { renderSitemap } = require("../controllers/seo");

// Dynamic XML Sitemap
router.get("/sitemap.xml", renderSitemap);

module.exports = router;
