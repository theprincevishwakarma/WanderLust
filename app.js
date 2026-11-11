if (process.env.NODE_ENV != "production") require("dotenv").config();

const express = require("express");
const app = express();

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");

const connectDB = require("./config/db");
const passport = require("./config/passport");
const { notFound, handler } = require("./middlewares/errors");
connectDB();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(require("./config/session"));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(require("./middlewares/locals"));

app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use("/", require("./routes"));

// Page Not Found
app.all("*splat", notFound);

// Error Handler middleware
app.use(handler);

app.listen("8080", () => {
  console.log("server is listening to 8080");
});
