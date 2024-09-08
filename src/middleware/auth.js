const authUser = (req, res, next) => {
	if (!req.user)
		return res.redirect('/login');
	// return res.status(403).json({ message: 'You need to sign in!' });
	next();
};

const authRole = (role) => {
	return (req, res, next) => {
		if (!req.user && req.user.role != role)
			return res.status(401).json({
				message: 'You are not allowed to access this site.',
			});
		next();
	};
};

module.exports = {
	authUser,
	authRole,
};
