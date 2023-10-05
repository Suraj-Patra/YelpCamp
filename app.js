const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();
const PORT = 8000;

/* Local Imports */
const Campground = require("./models/campground.model");

/* Database */
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then((res) => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error connecting MongoDB", err));

/* View Engine */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

/* Routers */
app.get("/", (req, res) => {
  res.render("home");
});

// Get Campground :
app.get("/campgrounds/allCamps", async (req, res) => {
  const camps = await Campground.find({});
  res.render("campgrounds/allCamps", { camps });
});
app.get("/campgrounds/oneCamp/:id", async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.render("campgrounds/oneCamp", { camp });
});

// Add Campground :
app.get("/campgrounds/newCamp", (req, res) => {
  res.render("campgrounds/newCamp");
});
app.post("/campgrounds/newCamp", async (req, res) => {
  const camp = await Campground.create(req.body);
  res.redirect(`/campgrounds/oneCamp/${camp._id}`);
});

// Edit Campground :
app.get("/campgrounds/editCamp/:id", async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.render("campgrounds/editCamp", { camp });
});
app.put("/campgrounds/editCamp/:id", async (req, res) => {
  const camp = await Campground.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/campgrounds/oneCamp/${camp._id}`);
});

// Delete Campground :
app.delete("/campgrounds/deleteCamp/:id", async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds/allCamps");
});

app.listen(PORT, () => console.log(`Server running at : ${PORT}`));
