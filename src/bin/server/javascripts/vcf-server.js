const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const lowdb = require('lowdb');
const bodyParser = require('body-parser');

const FileSync = require('lowdb/adapters/FileSync');
const helpers = require('./vcf-server-helpers');
const vcf_channels = require('../../../etc/channels.json');
exports.vcf_channels = vcf_channels;
const config = require('../../config.js');

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../client')));

app.get('/', path_root);

function path_root(req, res) {
    const videos = [];
    var lastChannelTitle;
    const channels = [];
    const hasWhiteMap = new Map();
    if (
        !req.query.hidden ||
        req.query.hidden == 'false' ||
        req.query.hidden == 'true'
    ) {
        var visibleVideosStream = db.get('videos');
        if (!req.query.hidden || req.query.hidden == 'false') {
            visibleVideosStream = visibleVideosStream.filter(
                (v) => v.visible == 'true' || v.visible
            );
        }
        if (req.query.channel && req.query.channel != 'all') {
            visibleVideosStream = visibleVideosStream.filter({
                channelId: req.query.channel,
            });
        }
        const visibleVideos = visibleVideosStream
            .sortBy('publishDate')
            .value()
            .reverse();
        visibleVideos.forEach((video) => {
            helpers.setFilterStatus(video);
            if (video.filter == helpers.filterStatus.WHITELIST) {
                hasWhiteMap.set(video.channelId, true);
            }
        });
        visibleVideos.forEach((video) => {
            if (
                req.query.hidden == 'true' ||
                (hasWhiteMap.has(video.channelId) &&
                    video.filter == helpers.filterStatus.WHITELIST) ||
                (!hasWhiteMap.has(video.channelId) &&
                    video.filter == helpers.filterStatus.NONE)
            ) {
                const channelsInDBFilter = db
                    .get('channels')
                    .filter({ channelId: video.channelId })
                    .value();
                video.channelTitle = channelsInDBFilter[0].channelTitle;
                lastChannelTitle = channelsInDBFilter[0].channelTitle;
                videos.push(video);
            }
        });
        const channelsInDB = db.get('channels').sortBy('channelTitle').value();
        channelsInDB.forEach((channel) => {
            channels.push(channel);
        });
        if (
            !lastChannelTitle &&
            req.query.channel &&
            req.query.channel != 'all'
        ) {
            lastChannelTitle = undefined;
            channels.length = 0;
        }
        if (!req.query.channel || req.query.channel == 'all') {
            lastChannelTitle = undefined;
        }
    }
    var displayHiddenVideos = 'false';
    if (req.query.hidden) {
        displayHiddenVideos = req.query.hidden;
    }
    res.render('index', {
        videos: videos,
        channels: channels,
        displayHiddenVideos: displayHiddenVideos,
        channel: req.query.channel,
        channelTitle: lastChannelTitle,
        whiteChannels: hasWhiteMap,
    });
}
exports.pathRoot = path_root;

app.post('/addVideoInDatabase', path_addVideoInDatabase);

function path_addVideoInDatabase(req, res) {
    if (
        !db.has('videos').value() ||
        !db.get('videos').find({ videoId: req.body.videoId }).value()
    ) {
        const videoDuration = helpers.youtubeDurationIntoSeconds(
            req.body.videoDuration
        );
        const newVideoData = {
            videoId: req.body.videoId,
            videoThumbnailSrc: req.body.videoThumbnailSrc,
            videoTitle: req.body.videoTitle,
            videoDuration: videoDuration,
            channelId: req.body.channelId,
            publishDate: req.body.publishDate,
            visible: req.body.visible,
        };
        db.get('videos').push(newVideoData).write();
    }
    if (
        !db.has('channels').value() ||
        !db.get('channels').find({ channelId: req.body.channelId }).value()
    ) {
        const newChannelData = {
            channelTitle: req.body.channelTitle,
            channelId: req.body.channelId,
            channelImage: req.body.channelImage,
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

app.post('/getParameters', path_getParameters);

function path_getParameters(req, res) {
    res.json({
        clientApiKey: config.CLIENT_API_KEY,
        clientId: config.CLIENT_ID,
        channels: vcf_channels.channels,
    });
    res.end();
}
exports.path_getParameters = path_getParameters;

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
const adapter = new FileSync(path.join(__dirname, '../../../var/db.json'));
const db = lowdb(adapter);
db.defaults({ videos: [] }).write();
db.defaults({ channels: [] }).write();
exports.db = db;
