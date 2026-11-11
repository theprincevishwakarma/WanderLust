const Listing = require("../models/listing");

module.exports.renderSitemap = async (req, res) => {
  try {
    const baseUrl = "https://staynest.bitofprince.site";

    const listings = await Listing.find({}, "_id updatedAt");

    const escapeXml = (value) =>
      String(value).replace(/[<>&'"]/g, (char) => {
        const entities = {
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          "'": "&apos;",
          '"': "&quot;",
        };
        return entities[char];
      });

    const staticUrls = [
      `${baseUrl}/`,
      `${baseUrl}/listings`,
      `${baseUrl}/staynest/privacy`,
      `${baseUrl}/staynest/terms`,
    ];

    const staticEntries = staticUrls.map(
      (url) => `
      <url>
        <loc>${escapeXml(url)}</loc>
      </url>`,
    );

    const listingEntries = listings.map((listing) => {
      const url = `${baseUrl}/listings/${listing._id}`;

      const lastmod = listing.updatedAt
        ? `<lastmod>${new Date(listing.updatedAt).toISOString()}</lastmod>`
        : "";

      return `
      <url>
        <loc>${escapeXml(url)}</loc>
        ${lastmod}
      </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...listingEntries].join("\n")}
</urlset>`;

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=300");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Unable to generate sitemap");
  }
};
