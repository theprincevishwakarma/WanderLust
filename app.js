const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const Listing = require("./models/listing");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hi , I am root");
});

// Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index", { allListings });
});

// New Route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/show", { listing });
});

// Create Route
app.post("/listings", async (req, res) => {
  // let { title, description, image, price, location, country } = req.body;
  // let listing = req.body;

  const newListing = new Listing(req.body);
  await newListing.save();
  res.redirect("/listings");
});

app.listen("8080", () => {
  console.log("server is listening to 8080");
});
