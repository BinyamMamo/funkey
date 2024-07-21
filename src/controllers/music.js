// Music Controller
const fs = require('fs');
const Music = require('../models/Music');

const getMusics = async (req, res) => {
  let musics = [];
  try {
    musics = await Music.find({ public: true });
    // if (req.session && req.session.userId) {
    //   let userId = req.session.userId;
    //   let privateMusics = await Music.find({ userId });
    //   musics.concat(privateMusics);
    // }
  } catch (err) {
    console.error(err);
  }
  return musics;
};

const uploadMusic = async (req, res) => {
  try {
    console.log('-----------------');
    console.log(req.body);

    let { artist, title, video, lyrics, thumbnail, public } = req.body;
    if (req.body.role && req.body.role === 'admin') public = true;
    else if (!req.session || !req.session.userId) {
      res
        .status(400)
        .json({ message: 'You need to sign in to upload musics!' });
      throw new Error('User is not signed in!');
    }
		
    // validate the above

    let userId = req.session.userId;
    let musicByTitle = await Music.findOne({ title });
    if (musicByTitle) {
      let musicByArtist = await Music.findOne({ artist });
      if (
        public &&
        musicByArtist &&
        JSON.stringify(musicByArtist) == JSON.stringify(musicByTitle)
      ) {
        res.status(400).json({
          message: 'Music with the same artist and title exists in db',
        }); // TODO: CHANGE THE STATUS CODE
        throw new Error('Music with the same artist and title exists in db');
      }
      console.log('musicByArtist:', JSON.stringify(musicByArtist));
    }

    let music = new Music({
      artist,
      title,
      video,
      lyrics,
      thumbnail: thumbnail || 'assets/images/default_thumbnail.jpg',
      public: !public ? false : public,
      userId,
    });

    await music.save();

    console.log('Music uploaded succesfully!', music);
    res.status(201).json({ message: 'Music uploaded succesfully!', music });
  } catch (err) {
    console.error(err);
  }
};

const renderMusic = async (req, res) => {
  try {
    let musicId = req.params.id || null;
    if (!musicId) {
      res.status(400).json({ error: 'Music id not found!' });
      throw new Error('Music id not found!');
    }

    let music = await Music.findById(musicId);
    if (!music) {
      res.status(400).json({ error: 'Music not found!' });
      throw new Error('Music not found!');
    }

    // For private musics
    if (!music.public) {
      let userId = req.session && req.session.userId;
      if (!userId || userId !== music.userId) {
        res.status(400).json({ error: 'Not Authorized!' });
        throw new Error('Not Authorized!');
      }
    }

    res.render('music', { music });
  } catch (err) {
    res.status(400).json({ error: err.message });
    console.error(err);
  }
};

const deleteMusic = async (req, res) => {
  try {
    let musicId = req.body.id || null;
    let music = await Music.findByIdAndDelete(musicId);
    if (!music) {
      res.status(400).json({ message: 'music not found' });
      throw new Error('music not found');
    }

    // remove video and lyrics files from server
    fs.unlinkSync(music.video);
    fs.unlinkSync(music.lyrics);

    res.status(200).json({
      message: `'${music.title}' by ${music.artist} is deleted succesfully!`,
      music,
    });
  } catch (err) {
    console.error(err.message);
  }
};

const updateViews = async (req, res) => {
  try {
    let musicId = req.params.musicId || null;

    let music = await Music.findById(musicId);
    if (!music) {
      res.status(400).json({ message: 'Music not fOund!' });
      throw new Error('Music not fOund!');
    }

    await music.updateOne({ $inc: { views: 1 } });
    res.json({ message: 'succesffuly updated views' });
  } catch (err) {
    console.error(err.message);
  }
};

const updateRating = async (req, res) => {
  try {
    let musicId = req.body.musicId || null;
    let rating = req.body.rating || null;
    console.log('updating rating...');
    console.log('music id', musicId);
    let music = await Music.findById(musicId);
    console.log('HERE');
    if (!music) {
      res.status(400).json({ message: 'Music not fOund!' });
      throw new Error('Music not found!');
    }

    // think about saving the rating on the user side
    if (rating) {
      console.log('give rating:', rating);
      console.log('before rating:', music.rating);
      music.rating = (parseFloat(rating) + parseFloat(music.rating)) / 2;
      await music.save();
      console.log('after rating:', music.rating);
    } else console.log('invalid rating');

    res.json({ message: 'succesffuly updated rating' });
  } catch (err) {
    console.error('error message', err.messsage);
  }
};

const toggleFavorite = async (req, res) => {
  try {
    let musicId = req.body.id || null;
    let music = await Music.findById(musicId);
    if (!music) {
      res.status(404).json({ message: 'Music not found' });
      throw new Error('Music not found');
    }

    music.favorite = music.favorite ? false : true;
		if (music.favorite) {
			const currentDate = new Date();
			const day = currentDate.getDate();
			const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
			const year = currentDate.getFullYear();

			music.favoritedAt = `${day}/${month}/${year}`;
		}
    await music.save();
    res.json({ message: 'Music added to favourites successfully!' });
  } catch (err) {
    console.error(err);
  }
};

const getFavorites = async (req, res) => {
  try {
    let musics = await Music.find({ favorite: true });
    res.json({ message: 'successfully loaded favorite musics!', musics });
  } catch (err) {
    console.error(err);
  }
};

const getMusic = async (req, res) => {
	try {
		let musicId = req.id || null;
		let music = await Music.findById(musicId);
		if (!music) {
			res.status(400).json('Music not found!')
			throw new Error('music not found');
		}

		res.json({message: 'music fetched successfully', music});
	} catch (err) {
		console.error(err);
	}
}

module.exports = {
	getMusic,
  getMusics,
  uploadMusic,
  renderMusic,
  deleteMusic,
  updateViews,
  getFavorites,
  updateRating,
  toggleFavorite,
};
