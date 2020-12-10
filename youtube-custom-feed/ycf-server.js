const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const lowdb = require('lowdb');
const bodyParser = require('body-parser');

const FileSync = require('lowdb/adapters/FileSync');
const helpers = require('./vcf-server-helpers');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', pathRoot);

function pathRoot(req, res) {
  const videos = [];
  var visibleVideosStream = db.get('videos');
  if (!req.query.hidden || req.query.hidden != "true") {
    visibleVideosStream = visibleVideosStream.filter((v => v.visible == 'true' || v.visible));
  }
  if (req.query.channel && req.query.channel != "all") {
    visibleVideosStream = visibleVideosStream.filter({ channelId: req.query.channel });
  }
  const visibleVideos = visibleVideosStream.sortBy('publishDate').value().reverse();
  var lastChannelTitle;
  visibleVideos.forEach(video => {
    helpers.setFilterStatus(video);
    if (req.query.hidden == "true" || video.filter == helpers.filterStatus.NONE) {
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
exports.pathRoot = pathRoot;

app.post('/addVideoInDatabase', path_addVideoInDatabase);

function path_addVideoInDatabase(req, res) {
  if (!db.has('videos').value() || !db.get('videos').find({ videoId: req.body.videoId }).value()) {
    const videoDuration = helpers.youtubeDurationIntoSeconds(req.body.videoDuration);
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
exports.path_addVideoInDatabase = path_addVideoInDatabase;

app.post('/swapVisibility', path_swapVisibility);

function path_swapVisibility(req, res) {
  const findData = db.get('videos').find({ videoId: req.body.videoId });
  const videoData = findData.value();
  if (videoData) {
    const currentVisible = videoData.visible;
    findData.assign({ visible: !currentVisible }).write();
    res.end();
  } else {
    res.status(500).end();
  }
}
exports.path_swapVisibility = path_swapVisibility;

// catch 404 and forward to error handler
app.use(errorHandler);

function errorHandler(req, res, next) {
  next(createError(404));
}
exports.errorHandler = errorHandler;

// error handler
app.use(errorHandlerPlus);

function errorHandlerPlus(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}
exports.errorHandlerPlus = errorHandlerPlus;

exports.app = app;

// database
const adapter = new FileSync('./youtube-custom-feed/db.json');
const db = lowdb(adapter);
db.defaults({ videos: [] }).write();
db.defaults({ channels: [] }).write();
exports.db = db;
