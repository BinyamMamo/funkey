const Roles = require('../utils/roles');
const Music = require('../models/Music');

const canAccess = (req, res, next) => {
	if (req.user.role != Roles.ADMIN || req.user._id != req.params.id) 
		return res.status(403).json({message: 'You are not allowed to access this resource!'});	
	next();
}

const scopeMusics = (req, musics) => {
	if (!req.user || req.user.role == Roles.GUEST)
		return musics.filter(music => music.public == true);
	else if (req.user.role == Roles.BASIC)
		return musics.filter(music => music.public == true && music.userId == req.user._id);
	return musics;
}

module.exports = {
	canAccess,
	scopeMusics
}