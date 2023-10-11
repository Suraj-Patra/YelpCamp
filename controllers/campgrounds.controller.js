/* Local Imports */
const Campground = require('../models/campground.model');
const { cloudinary } = require('../cloudinary/');

// Get Campground :
const handleGetAllCampgrounds = async (req, res) => {
	const camps = await Campground.find({});
	res.render('campgrounds/allCamps', { camps });
};
const handleGetOneCampground = async (req, res) => {
	const camp = await Campground.findById(req.params.id)
		.populate({ path: 'reviews', populate: { path: 'author' } })
		.populate('author');
	// If campground not found
	if (!camp) {
		req.flash('error', 'Campground not found!');
		return res.redirect('/campgrounds/allCamps');
	}
	res.render('campgrounds/oneCamp', { camp });
};

// Add Campground :
const handleRenderAddCampground = (req, res) => {
	res.render('campgrounds/newCamp');
};
const handleAddCampground = async (req, res, next) => {
	const camp = await Campground.create({
		...req.body,
		author: req.user._id,
		images: req.files.map((file) => ({
			url: file.path,
			filename: file.filename,
		})),
	});
	req.flash('success', 'Successfully made a new campground!');
	res.redirect(`/campgrounds/oneCamp/${camp._id}`);
};

// Edit Campground :
const handleRenderEditCampground = async (req, res) => {
	const camp = await Campground.findById(req.params.id);
	// If campground not found
	if (!camp) {
		req.flash('error', 'Campground not found!');
		return res.redirect('/campgrounds/allCamps');
	}
	res.render('campgrounds/editCamp', { camp });
};
const handleEditCampground = async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findByIdAndUpdate(id, req.body);
	const images = req.files.map((file) => ({
		url: file.path,
		filename: file.filename,
	}));
	camp.images.push(...images);
	await camp.save();
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await camp.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		});
	}
	req.flash('success', 'Successfully updated campground!');
	res.redirect(`/campgrounds/oneCamp/${camp._id}`);
};

// Delete Campground :
const handleDeleteCampground = async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id);
	req.flash('success', 'Successfully deleted campground!');
	res.redirect('/campgrounds/allCamps');
};

module.exports = {
	handleGetAllCampgrounds,
	handleGetOneCampground,
	handleRenderAddCampground,
	handleAddCampground,
	handleRenderEditCampground,
	handleEditCampground,
	handleDeleteCampground,
};
