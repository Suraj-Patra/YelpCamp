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

module.exports = {
	isLoggedIn,
	storeReturnTo,
};
