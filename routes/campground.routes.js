const express = require('express');
const router = express.Router();

/* Local Imports */
const Campground = require('../models/campground.model');
const catchAsync = require('../utils/catchAsync.util'); // For catching asynchronous errors
const ExpressError = require('../utils/ExpressError.util'); // For customized errors
const { campgroundSchema } = require('../JoiSchemas');

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

// Get Campground :
router.get(
	'/allCamps',
	catchAsync(async (req, res) => {
		const camps = await Campground.find({});
		res.render('campgrounds/allCamps', { camps });
	})
);
router.get(
	'/oneCamp/:id',
	catchAsync(async (req, res) => {
		const camp = await Campground.findById(req.params.id).populate(
			'reviews'
		);
		// If campground not found
		if (!camp) {
			req.flash('error', 'Campground not found!');
			return res.redirect('/campgrounds/allCamps');
		}
		res.render('campgrounds/oneCamp', { camp });
	})
);

// Add Campground :
router.get('/newCamp', (req, res) => {
	res.render('campgrounds/newCamp');
});
router.post(
	'/newCamp',
	validateCampground,
	catchAsync(async (req, res, next) => {
		const camp = await Campground.create(req.body);
		req.flash('success', 'Successfully made a new campground!');
		res.redirect(`/campgrounds/oneCamp/${camp._id}`);
	})
);

// Edit Campground :
router.get(
	'/editCamp/:id',
	catchAsync(async (req, res) => {
		const camp = await Campground.findById(req.params.id);
		// If campground not found
		if (!camp) {
			req.flash('error', 'Campground not found!');
			return res.redirect('/campgrounds/allCamps');
		}
		res.render('campgrounds/editCamp', { camp });
	})
);
router.put(
	'/editCamp/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const camp = await Campground.findByIdAndUpdate(
			req.params.id,
			req.body
		);
		req.flash('success', 'Successfully updated campground!');
		res.redirect(`/campgrounds/oneCamp/${camp._id}`);
	})
);

// Delete Campground :
router.delete(
	'/deleteCamp/:id',
	catchAsync(async (req, res) => {
		await Campground.findByIdAndDelete(req.params.id);
		req.flash('success', 'Successfully deleted campground!');
		res.redirect('/campgrounds/allCamps');
	})
);

module.exports = router;
