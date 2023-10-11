/* seeds are for storing some hardcoded data into database, Because for testing, we might not get enough data from the users to store into DB */

const mongoose = require('mongoose');

/* Local Imports */
const Campground = require('../models/campground.model');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

/* Database */
mongoose
	.connect('mongodb://127.0.0.1:27017/yelp-camp')
	.then((res) => console.log('MongoDB Connected'))
	.catch((err) => console.log('Error connecting MongoDB', err));

// Getting a random place or descriptor :
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	//   Storing random 50 cities in DB :
	for (let i = 0; i < 50; i++) {
		const imageWidth = 480; //image width in pixels
		const imageHeight = 480; //image height in pixels
		const collectionID = 1319040; //928423 - Beach & Coastal, the collection ID from the original url

		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		await Campground.create({
			author: '6524124ea59f3e8122122f36',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			/* 
				alternate -> image: `https://loremflickr.com/300/300/woods?random=${i}`,
				below source -> https://allegra9.medium.com/unsplash-without-api-ab2dcdb503a0
				image: `https://source.unsplash.com/collection/${collectionID}/${imageWidth}x${imageHeight}/?sig=${i}`,
			*/
			images: [
				{
					url: 'https://res.cloudinary.com/dl5dlqqco/image/upload/v1696947001/YelpCamp/rnf4eswludbgtiziauec.jpg',
					filename: 'YelpCamp/rnf4eswludbgtiziauec',
				},
				{
					url: 'https://res.cloudinary.com/dl5dlqqco/image/upload/v1696947011/YelpCamp/rp0qxrmmbu9kaldcjiah.jpg',
					filename: 'YelpCamp/rp0qxrmmbu9kaldcjiah',
				},
				{
					url: 'https://res.cloudinary.com/dl5dlqqco/image/upload/v1696947018/YelpCamp/jon6ihwwzizgpchehut0.jpg',
					filename: 'YelpCamp/jon6ihwwzizgpchehut0',
				},
				{
					url: 'https://res.cloudinary.com/dl5dlqqco/image/upload/v1696947048/YelpCamp/jfprfmt9vhbzjwuszcmh.png',
					filename: 'YelpCamp/jfprfmt9vhbzjwuszcmh',
				},
			],
			description:
				'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti, fuga.',
			price: price,
		});
	}
};
// After saving to the DB, closing the connection :
seedDB().then(() => mongoose.connection.close());
