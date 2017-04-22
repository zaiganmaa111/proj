var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var index = require('./routes/index');
var users = require('./routes/users');
var con_homePage = require('./routes/con_homePage');//系统总览
var con_overview = require('./routes/con_overview');//系统总览
var con_motor = require('./routes/con_motor');//参数列表
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/con_homePage', con_homePage);
app.use('/con_overview', con_overview);
app.use('/con_motor',con_motor);

/*/路由*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


var redis = require("redis");
var Q = require('q');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var cms_device_info_sub = redis.createClient(19000, "hao.oudot.cn");

var cms_device_status_sub = redis.createClient(19000, "hao.oudot.cn");

cms_device_info_sub.on("subscribe", function (channel, message) {
    console.log("cms_device_info_sub" +channel + message);
});

cms_device_status_sub.on("subscribe", function (channel, message) {
    console.log("cms_device_status_sub"+channel + message);
});

cms_device_info_sub.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
    var promise = circuit_device.deviceHelp.getcms_device_info_q(message);//deviceTag
    promise.then(function (data) {
        console.log(data);
        io.emit('cms_device_info', data);
    });
});

cms_device_status_sub.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
    var promise = circuit_device.deviceHelp.getStatus_q(message);//wfid
    promise.then(function (data) {
        console.log(data);
        io.emit('cms_device_info', data);
    });
});

cms_device_info_sub.subscribe("cms_device_info");
cms_device_status_sub.subscribe("cms_device_status");

io.on('connection', function () { /* … */
});

server.listen(4000, function () {
    console.log('ws app listening on port 4000!');
});

io.sockets.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});//前端通过socket.on("news")获取
    socket.on('paper', function (data) {//前端通过socket.emit('paper')发送
        socket.emit('news', {hello: 'world'});

        console.log(data);
    });
});


module.exports = app;
