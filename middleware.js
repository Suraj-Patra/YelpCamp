const ExpressError = require('./utils/ExpressError.util'); // For customized errors
const { campgroundSchema, reviewSchema } = require('./JoiSchemas');
const Campground = require('./models/campground.model');
const Review = require('./models/review.model');

const isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be logged in!');
		return res.redirect('/users/login');
	}
	next();
};
const storeReturnTo = (req, res, next) => {
	if (req.session.returnTo) {
		res.locals.returnTo = req.session.returnTo;
	}
	next();
};

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
async function isAuthor(req, res, next) {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	if (!camp.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/campgrounds/oneCamp/${camp._id}`);
	}
	next();
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
async function isReviewAuthor(req, res, next) {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/campgrounds/oneCamp/${id}`);
	}
	next();
}

module.exports = {
	isLoggedIn,
	storeReturnTo,
	validateCampground,
	isAuthor,
	validateReview,
	isReviewAuthor,
};
