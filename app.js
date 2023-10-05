const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

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

/* Routers */
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/makecampground", async (req, res) => {
  const camp = await Campground.create({
    title: "My Backyard",
    description: "Free camping",
  });
  res.send(camp);
});

app.listen(PORT, () => console.log(`Server running at : ${PORT}`));
