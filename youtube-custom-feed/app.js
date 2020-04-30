const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const lowdb = require('lowdb');
const bodyParser = require("body-parser");

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
    res.render('index', { videos: db.get('videos').value() });
  }
);

app.post('/addVideoInDatabase',
  function (req, res) {
    if (!db.has('videos').value() || !db.get('videos').find({ videoId: req.body.videoId }).value()) {
      db.get('videos').push(req.body).write();
    }
    res.end();
  }
);

app.post('/mask',
    function(req, res) {
        setVisibility(req, res, false);
    }
);

app.post('/visible',
    function(req, res) {
        setVisibility(req, res, true);
    }
);

function setVisibility(req, res, visible) {
    if (db.has('videos').value() && db.get('videos').find({ videoId: req.body.videoId }).value()) {
        db.get('videos').find({ videoId: req.body.videoId }).assign({ visible: visible }).write()
    }
    res.end();
}

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