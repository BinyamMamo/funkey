const MusicLibrary = require('../models/MusicLibrary');
const Music = require('../models/Music');
const User = require('../models/User');

async function findMusics(condition) {
	// let musics = [];
	// let favorites = await MusicLibrary.aggregate(condition);
	// favorites.map(async (favorite) => {
	// 	favorite = await Music.findById(favorite.musicId);
	// });
	console.log('condition:', condition);
	let favorites = await MusicLibrary.aggregate([
		{
			$match: condition,
		},
		{
			$lookup: {
				from: 'musics',
				localField: 'musicId',
				foreignField: '_id',
				as: 'music',
			},
		},
		{
			$sort: { updatedAt: -1 }
		},
		{
			$unwind: '$music',
		},
		{
			$addFields: {
				'music.type': '$type'
			}
		},
		{
			$replaceRoot: { newRoot: '$music' },
		},
	]);

	console.log('allMusic:', favorites);

	return favorites;
}

const getLibrary = async (req, res) => {
	try {
		// let musics = await findMusics({upload: true, favorite: true})
		console.log('getting musics');
		let musics = await findMusics({});
		console.log('musics:', musics);
		return res.status(200).json({ musics });
	} catch (err) {
		return res.status(400).json(err);
	}
};

const getFavorites = async (req, res) => {
	try {
		let musics = await findMusics({ favorite: true });

		return res.status(200).json({ musics });
	} catch (err) {
		return res.status(400).json(err);
	}
};


const getUploads = async (req, res) => {
	try {
		let musics = await findMusics({ upload: true });

		return res.status(200).json({ musics });
	} catch (err) {
		return res.status(400).json(err);
	}
};

const getFavorite = async (req, res) => {
	try {
		let musicId = req.params.id || null;
		console.log('musicId:', musicId);
		let userId = req.user._id || null;
		let music = await MusicLibrary.findOne({ musicId, userId, favorite: true });
		if (!music)
			return res.status(400).json({});

		return res.status(200).json({ music });
	} catch (err) {
		return res.status(400).json({});
	}
};

const toggleFavorite = async (req, res) => {
	try {
		let musicId = req.params.id || null;
		let userId = req.user._id || null;
		console.log('musicId:', musicId);
		let music = await MusicLibrary.findOne({ musicId, userId });
		if (!music) {
			let music = new MusicLibrary({
				userId,
				musicId,
				favorite: true,
				type: 'favorite',
			});
			await music.save();
			return res.json({ message: 'Music added to favorites successfully!' });
		}

		if (music.type == 'favorite') {
			await music.deleteOne();
			return res.json({ message: 'Music removed from favorite successfully!' });
		}
		music.favorite = !music.favorite;
		await music.save();

		return res.json({ message: 'Music favorite toggled successfully!' });
	} catch (err) {
		console.error(err);
	}
};

// User related
const updateHour = async (req, res) => {
	try {
		let duration = req.body.watchHour || 0;
		let musicId = req.body.musicId || null;
		let userId = req.user._id;

		let user = await User.findById(userId);
		user.watchHour += duration;
		await user.save();

		let library = await MusicLibrary.findOne({ userId, musicId });
		if (!library)
			library = new MusicLibrary({ userId, musicId, type: 'watched' });

		library.watchHour += duration;
		await library.save();

		console.log('User watch hour is updated by', duration);
		res.status(200).json({ message: 'update successful' });
	} catch (err) {
		console.error(err);
	}
};

const updateViews = async (req, res) => {
	try {
		let userId = req.user._id || null;
		let musicId = req.params.id || null;

		let music = await Music.findById(musicId);
		if (!music) {
			console.error('Error: Music not fOund!');
			return res.status(400).json({ message: 'Music not fOund!' });
		}
		await music.updateOne({ $inc: { views: 1 } });

		let library = await MusicLibrary.findOne({ userId, musicId });
		if (!library) library = new MusicLibrary({ userId, musicId, type: 'watched' });
		await library.updateOne({ $inc: { views: 1 } });

		res.json({ message: 'succesffuly updated views' });
	} catch (err) {
		console.error(err.message);
	}
};

const updateRating = async (req, res) => {
	try {
		let userId = req.user._id || null;
		let rating = req.body.rating || null;
		let musicId = req.body.musicId || null;
		if (!rating) {
			console.log('invalid rating');
			return res.json({ message: 'invalid rating' });
		}

		let music = await Music.findById(musicId);
		if (!music) {
			console.error('Error: Music not found!');
			return res.status(400).json({ message: 'Music not fOund!' });
		}

		music.rating = (parseFloat(rating) + parseFloat(music.rating)) / 2;
		await music.save();
		console.log('updated rating:', music.rating);

		music = await MusicLibrary.findOne({ userId, musicId });
		if (!music) music = new MusicLibrary({ userId, musicId, type: 'rated' });
		music.rating = rating;
		await music.save();

		res.json({ message: 'succesffuly updated rating' });
	} catch (err) {
		console.error('error message', err.messsage);
	}
};

module.exports = {
	updateHour,
	updateViews,
	getLibrary,
	getUploads,
	getFavorite,
	getFavorites,
	updateRating,
	toggleFavorite,
};
