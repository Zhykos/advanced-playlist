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
    const videos = [];
    var visibleVideosStream = db.get('videos');
    console.log(req.query.hidden);
    if (!req.query.hidden || req.query.hidden != "true") {
      visibleVideosStream = visibleVideosStream.filter((v => v.visible == 'true' || v.visible));
    }
    if (req.query.channel && req.query.channel != "all") {
      visibleVideosStream = visibleVideosStream.filter({ channelId: req.query.channel });
    }
    const visibleVideos = visibleVideosStream.sortBy('publishDate').value().reverse();
    var lastChannelTitle;
    visibleVideos.forEach(video => {
      setFilterStatus(video);
      if (req.query.hidden == "true" || video.filter == filterStatus.NONE) {
        const channelsInDB = db.get('channels').filter({ channelId: video.channelId }).value();
        video.channelTitle = channelsInDB[0].channelTitle;
        lastChannelTitle = channelsInDB[0].channelTitle;
        videos.push(video);
      }
    });
    const channels = [];
    const channelsInDB = db.get('channels').sortBy('channelTitle').value();
    channelsInDB.forEach(channel => {
      channels.push(channel);
    });
    if (!lastChannelTitle && req.query.channel && req.query.channel != "all") {
      const channelsInDB = db.get('channels').filter({ channelId: req.query.channel }).value();
      lastChannelTitle = channelsInDB[0].channelTitle;
    }
    res.render('index', { videos: videos, channels: channels, displayHiddenVideos: req.query.hidden, channel: req.query.channel, channelTitle: lastChannelTitle });
  }
);

const filterStatus = {
  NONE: 'NONE',
  BLACKLIST: 'BLACKLIST',
  WHITELIST: 'WHITELIST'
};

function setFilterStatus(video) {
  video["filter"] = filterStatus.NONE;
  const channelId = video.channelId;
  ycf.channels.forEach(channel => {
    if (channel.id == channelId) {
      const whitelist = channel.whitelist;
      const blacklist = channel.blacklist;
      if (whitelist) {
        whitelist.forEach(white => {
          filterVideo(white, video, filterStatus.WHITELIST);
        });
      }
      if (blacklist) {
        blacklist.forEach(black => {
          filterVideo(black, video, filterStatus.BLACKLIST);
        });
      }
      return;
    }
  });
}

function filterVideo(filter, video, expectedStatus) {
  try {
    const parts = filter.split('=~');
    if (parts.length > 1) {
      if ((!video[parts[0]].match(parts[1])) == (expectedStatus == filterStatus.WHITELIST)) {
        video["filter"] = expectedStatus;
      }
    } else {
      const parts = filter.split('>');
      if (parts.length > 1) {
        if (video[parts[0]] <= youtubeDurationIntoSeconds(parts[1]) == (expectedStatus == filterStatus.WHITELIST)) {
          video["filter"] = expectedStatus;
        }
      }
    }
  } catch (exception) {
    console.error(exception);
  }
}

// Thanks :) https://gist.github.com/denniszhao/8972cd4ae637cf10fe01
function youtubeDurationIntoSeconds(duration) {
  var a = duration.match(/\d+H|\d+M|\d+S/g);
  var result = 0;
  var d = { 'H': 3600, 'M': 60, 'S': 1 };

  for (var i = 0; i < a.length; i++) {
    const num = a[i].slice(0, a[i].length - 1);
    const type = a[i].slice(a[i].length - 1, a[i].length);
    result += parseInt(num) * d[type];
  }
  return result;
}

app.post('/addVideoInDatabase',
  function (req, res) {
    if (!db.has('videos').value() || !db.get('videos').find({ videoId: req.body.videoId }).value()) {
      const videoDuration = youtubeDurationIntoSeconds(req.body.videoDuration);
      const newVideoData = {
        videoId: req.body.videoId,
        videoThumbnailSrc: req.body.videoThumbnailSrc,
        videoTitle: req.body.videoTitle,
        videoDuration: videoDuration,
        channelId: req.body.channelId,
        publishDate: req.body.publishDate,
        visible: req.body.visible
      };
      db.get('videos').push(newVideoData).write();
    }
    if (!db.has('channels').value() || !db.get('channels').find({ channelId: req.body.channelId }).value()) {
      const newChannelData = {
        channelTitle: req.body.channelTitle,
        channelId: req.body.channelId,
        channelImage: req.body.channelImage
      };
      db.get('channels').push(newChannelData).write();
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
const adapter = new FileSync('./youtube-custom-feed/db.json');
const db = lowdb(adapter);
db.defaults({ videos: [] }).write();
db.defaults({ channels: [] }).write();
