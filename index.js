const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
// import Mongoose
const mongoose = require("mongoose")
mongoose.connect('mongodb+srv://farhanyp:kwU7vLFZItO5MLH8@cluster1.3o3a3wr.mongodb.net/db_mern_staycation?retryWrites=true&w=majority');


var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sb-admin-2', express.static(path.join(__dirname,'/node_modules/startbootstrap-sb-admin-2')))


// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/', adminRouter)
// app.use('/api/v1/member', apiRouter)


app.listen(3000, () => console.log('Sever Running On port 3000'))

module.exports = app;