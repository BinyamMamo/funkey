require('dotenv').config();
const Music = require('../models/Music');
const User = require('../models/User');
const ytdl = require('ytdl-core');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const { getSubtitles } = require('youtube-captions-scraper');
const { getCaptions } = require('../utils/yt_subtitle');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const getMusic = async (req, res) => {
  console.log('getting music...');
  try {
    let musicId = req.params.id;
    let music = await Music.findById(musicId);
    console.log('music:', music);
    return res.status(200).json({ music, message: 'music fetch successful' });
  } catch (err) {
    res.status(400).json(err);
    console.error(err);
  }
};

const getMusics = async (req, res) => {
  try {
    let musics = await Music.find();
    console.log('musics:', musics);
    return res
      .status(200)
      .json({ musics, message: 'musics fetched successfuly' });
  } catch (err) {
    res.status(400).json(err);
    console.error(err);
  }
};

const getThumbnail = async (req, res) => {
  try {
    let videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'No URL provided' });

    let videoId = ytdl.getVideoID(videoUrl);
    let thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    let hq = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    let lq = `https://img.youtube.com/vi/${videoId}/default.jpg`;

    return res.json({ url: thumbnail, hq, lq });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getDetails = async (req, res) => {
  try {
    let videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'No URL provided' });

    let title = null;
    try {
      let videoId = ytdl.getVideoID(videoUrl);
      title = await getVideoTitle(videoId);
      if (!title || title == '') throw new Error("couldn't fetch title");
    } catch (err) {
      console.error(err);
      return {
        artist: 'unknown',
        title: 'track',
        video: 'unkown-track',
      };
    }

    let prompt = `Extract the title and artist name from the following music video title, if possible, and return only a JSON formatted response. Do not add anything else to the output. 
									Video title: "${title}"\n
									Output example:
									{"title": "example title", "artist": "example artist"}`;

    try {
      let model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      console.log('response:', response);

      const details = JSON.parse(response);
      details['video'] = title;
      return res.json(details);
    } catch (err) {
      console.error(err);
      let arr = title.split('-');
      return {
        title: arr && arr[0],
        artist: arr && arr[1],
        video: title,
      };
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getVideo = async (req, res) => {
  try {
    let videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'No URL provided' });

    let response = await axios.get(
      'https://render-flask-ytdl.onrender.com/video',
      {
        params: { url: videoUrl },
      }
    );
    // const response = await retry(async () => {
    // 		console.log('res:', res);
    // 		return res;
    //   }, 3, 1000);

    console.log('response.data:', response.data);

    return res.json(response.data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getLyrics = async (req, res) => {
  try {
    let videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: 'No URL provided' });

    let lyrics = await downloadCaptions(videoUrl);
    return res.json(lyrics);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Functions
async function getVideoTitle(videoId) {
  try {
    let info = await ytdl.getInfo(videoId);

    console.log('info:', info);
    let title = info.videoDetails.title;

    return title;
  } catch (err) {
    return null;
  }
}

// Function to format time in SRT format (HH:MM:SS,SSS)
function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const milliseconds = ms % 1000;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(secs).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
}

// Retry function
async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${i + 1} failed: ${error.message}`);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

async function retryFuns(fn1, fun2, retries = 2, delay = 1000) {
  // Try fn1 first
  try {
    let result = await retry(fn1, retries, delay);
		console.log('result:', result);
		return result;
  } catch (error) {
    console.log('fn1 failed, trying fn2...');
  }

  try {
    return await retry(fn2, retries, delay);
  } catch (err) {
    throw new Error('Both functions failed');
  }
}

async function downloadCaptions(videoUrl) {
  try {
    let videoId = ytdl.getVideoID(videoUrl);
    let subtitles = await retryFuns(
      async () => {
        return await getCaptions(videoId);
      },
      async () => {
        subtitles = await getSubtitles({
          videoID: videoId,
          lang: 'en',
        });
        return subtitles
          .map((sub, index) => {
            let start = parseFloat(sub.start);
            let dur = parseFloat(sub.dur);

            const end = formatTime((start + dur) * 1000);
            start = formatTime(start * 1000);
            return `${index + 1}\n${start} --> ${end}\n${sub.text}\n`;
          })
          .join('\n');
      }
    );

		console.log('subtitles:', subtitles);

    return subtitles;
  } catch (error) {
    console.error('Error downloading captions:', error);
    throw error; // Ensure the error is propagated so the caller knows it failed
  }
}

module.exports = {
  getMusic,
  getVideo,
  getLyrics,
  getMusics,
  getDetails,
  getThumbnail,
};
