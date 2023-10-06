/* seeds are for storing some hardcoded data into database, Because for testing, we might not get enough data from the users to store into DB */

const mongoose = require("mongoose");

/* Local Imports */
const Campground = require("../models/campground.model");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

/* Database */
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then((res) => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error connecting MongoDB", err));

// Getting a random place or descriptor :
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  //   Storing random 50 cities in DB :
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    await Campground.create({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://loremflickr.com/300/300/woods?random=${i}`,
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti, fuga.",
      price: price,
    });
  }
};
// After saving to the DB, closing the connection :
seedDB().then(() => mongoose.connection.close());
