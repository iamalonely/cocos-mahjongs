var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mahjongRouter = require('./routes/mahjong');
var Room = require('./utils/mahjong_rule')
var app = express();
const room1 = new Room(1, {username: 'pengsiwei', id: 1})
room1.enterRoom({username: '2'})
room1.enterRoom({username: '3'})
room1.enterRoom({username: '4'})
const mahjongs = room1.shuffle()
room1.getZhuangPlayer()
room1.fapai()
room1.players[0].checkPingFu()
// room1.enterRoom()
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.all('*',function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-type');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH")
  next()
})
global.io.on('connection', socket=> {
  console.log('client connect server, ok!');
  // io.emit()方法用于向服务端发送消息，参数1表示自定义的数据名，参数2表示需要配合事件传入的参数
  // io.emmit('server message', {msg:'client connect server success'});

  // socket.broadcast.emmit()表示向除了自己以外的客户端发送消息
  socket.emit('news', { hello: 'world' });
})
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/mahjong', mahjongRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err,res)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
