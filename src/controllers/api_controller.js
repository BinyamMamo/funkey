const Music = require('../models/Music');
const User = require('../models/User');

const getMusic = async(req, res) => {
	console.log('getting music...');
	try {
		let musicId = req.params.id;
		let music = await Music.findById(musicId);
		console.log('music:', music);
		return res.status(200).json({music, message: 'music fetch successful'});
	} catch (err) {
		res.status(400).json(err);
		console.error(err);
	}
}

const getMusics = async(req, res) => {
	try {
		let musics = await Music.find();
		console.log('musics:', musics);
		return res.status(200).json({musics, message: 'musics fetched successfuly'});
	} catch (err) {
		res.status(400).json(err);
		console.error(err);
	}
}

module.exports = {
	getMusic,
	getMusics
}