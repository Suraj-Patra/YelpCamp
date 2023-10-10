/* Local Imports */
const User = require('../models/user.model');

/* Register */
const handleRenderUserRegister = (req, res) => {
	res.render('users/register');
};
const handleUserRegister = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;
		const user = new User({ username, email });
		const newUser = await User.register(user, password);
		req.login(newUser, (err) => {
			if (err) return next(err);
			req.flash('success', 'Welcome to Yelp Camp!');
			res.redirect('/campgrounds/allCamps');
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/users/register');
	}
};

/* Login */
const handleRenderUserLogin = (req, res) => {
	res.render('users/login');
};
const handleUserLogin = (req, res) => {
	req.flash('success', 'Welcome back!');
	const redirectUrl = res.locals.returnTo || '/campgrounds/allCamps';
	res.redirect(redirectUrl);
};

/* Logout */
const handleUserLogout = (req, res) => {
	req.logout((err) => {
		if (err) return next(err);
		req.flash('success', 'Successfully Logged out!');
		res.redirect('/campgrounds/allCamps');
	});
};

module.exports = {
	handleRenderUserRegister,
	handleUserRegister,
	handleRenderUserLogin,
	handleUserLogin,
	handleUserLogout,
};
