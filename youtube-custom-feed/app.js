const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const lowdb = require('lowdb');
const bodyParser = require("body-parser");

const ycf = require('./public/youtube-custom-feed/parameters.json');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',
  function (req, res) {
    var videos = [];
    const visibleVideos = db.get('videos').filter({visible: 'true'}).sortBy('publishDate').value().reverse();
    visibleVideos.forEach(video => {
      const filteredVideo = filter(video);
      if (filteredVideo) {
        videos.push(filteredVideo);
      }
    });
    res.render('index', { videos: videos });
  }
);

function filter (video) {
  var result = null;
  const channelId = video.channelId;
  ycf.channels.forEach(channel => {
    if (channel.id == channelId) {
      const whitelist = channel.whitelist;
      const blacklist = channel.blacklist;
      if (whitelist) {
        whitelist.forEach(white => {
          const parts = white.split('=~');
          if (video[parts[0]].match(parts[1])) {
            result = video;
          }
        });
      }
      if (blacklist && result == null) {
        blacklist.forEach(black => {
          const parts = black.split('=~');
          if (!video[parts[0]].match(parts[1])) {
            result = video;
          }
        });
      }
      return;
    }
  });
  return result;
}

app.post('/addVideoInDatabase',
  function (req, res) {
    if (!db.has('videos').value() || !db.get('videos').find({ videoId: req.body.videoId }).value()) {
      db.get('videos').push(req.body).write();
    }
    res.end();
  }
);

app.post('/swapVisibility',
  function (req, res) {
    if (db.has('videos').value()) {
      const findData = db.get('videos').find({ videoId: req.body.videoId });
      const videoData = findData.value();
      if (videoData) {
        const currentVisible = videoData.visible;
        findData.assign({ visible: !currentVisible }).write();
        res.end();
      } else {
        res.status(500).end();
      }

    } else {
      res.status(500).end();
    }
  }
);

// catch 404 and forward to error handler
app.use(
  function (req, res, next) {
    next(createError(404));
  }
);

// error handler
app.use(
  function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
);

module.exports = app;

// database
const adapter = new FileSync('db.json');
const db = lowdb(adapter);
db.defaults({ videos: [] }).write();