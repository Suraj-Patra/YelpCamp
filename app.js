const path = require('path');
const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();
const PORT = 8000;

/* Local Imports */
const Campground = require('./models/campground.model');
const Review = require('./models/review.model');
const catchAsync = require('./utils/catchAsync.util'); // For catching asynchronous errors
const ExpressError = require('./utils/ExpressError.util'); // For customized errors
const { campgroundSchema, reviewSchema } = require('./JoiSchemas');

/* Database */
mongoose
	.connect('mongodb://127.0.0.1:27017/yelp-camp')
	.then((res) => console.log('MongoDB Connected'))
	.catch((err) => console.log('Error connecting MongoDB', err));

/* View Engine */
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Middlewares for validation :
function validateCampground(req, res, next) {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
}
function validateReview(req, res, next) {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
}

/* Routers */
app.get('/', (req, res) => {
	res.render('home');
});

// Get Campground :
app.get(
	'/campgrounds/allCamps',
	catchAsync(async (req, res) => {
		const camps = await Campground.find({});
		res.render('campgrounds/allCamps', { camps });
	})
);
app.get(
	'/campgrounds/oneCamp/:id',
	catchAsync(async (req, res) => {
		const camp = await Campground.findById(req.params.id).populate(
			'reviews'
		);
		res.render('campgrounds/oneCamp', { camp });
	})
);

// Add Campground :
app.get('/campgrounds/newCamp', (req, res) => {
	res.render('campgrounds/newCamp');
});
app.post(
	'/campgrounds/newCamp',
	validateCampground,
	catchAsync(async (req, res, next) => {
		const camp = await Campground.create(req.body);
		res.redirect(`/campgrounds/oneCamp/${camp._id}`);
	})
);

// Edit Campground :
app.get(
	'/campgrounds/editCamp/:id',
	catchAsync(async (req, res) => {
		const camp = await Campground.findById(req.params.id);
		res.render('campgrounds/editCamp', { camp });
	})
);
app.put(
	'/campgrounds/editCamp/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const camp = await Campground.findByIdAndUpdate(
			req.params.id,
			req.body
		);
		res.redirect(`/campgrounds/oneCamp/${camp._id}`);
	})
);

// Delete Campground :
app.delete(
	'/campgrounds/deleteCamp/:id',
	catchAsync(async (req, res) => {
		await Campground.findByIdAndDelete(req.params.id);
		res.redirect('/campgrounds/allCamps');
	})
);

// Review for Campground :
app.post(
	'/campgrounds/:id/reviews',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = await Review.create(req.body);
		campground.reviews.push(review);
		await campground.save();
		res.redirect(`/campgrounds/oneCamp/${campground._id}`);
	})
);
app.delete(
	'/campgrounds/:id/reviews/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		// remove an element from an array in mongo
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: reviewId },
		});
		await Review.findByIdAndDelete(reviewId);
		res.redirect(`/campgrounds/oneCamp/${id}`);
	})
);

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});

// 404 Not Found :
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong!';
	res.status(statusCode).render('error', { err });
});

app.listen(PORT, () => console.log(`Server running at : ${PORT}`));
