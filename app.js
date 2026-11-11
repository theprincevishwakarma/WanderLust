if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const bookingRouter = require("./routes/booking");

const Listing = require("./models/listing");

// const dbUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLUSDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("Error in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // SEO: Canonical URL
  res.locals.canonicalUrl = `https://staynest.bitofprince.site${req.path}`;
  next();
});

app.get("/privacy", (req, res) => {
  res.render("privacy");
});

app.get("/terms", (req, res) => {
  res.render("terms");
});

// Dynamic XML Sitemap
app.get("/sitemap.xml", async (req, res) => {
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
      `${baseUrl}/privacy`,
      `${baseUrl}/terms`,
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
});

app.use("/listings", listingRouter);
app.use("/book/stays", bookingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Page Not Found
app.all("*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error Handler middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some Error Occurred!" } = err;
  res.status(statusCode).render("error", { message });
});

app.listen("8080", () => {
  console.log("server is listening to 8080");
});
