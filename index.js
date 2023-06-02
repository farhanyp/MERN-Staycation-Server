const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const logger = require('morgan');
const indexRouter = require('./routes/index');
// import Mongoose
const mongoose = require("mongoose")
mongoose.connect('mongodb+srv://farhanyp:kwU7vLFZItO5MLH8@cluster1.3o3a3wr.mongodb.net/db_mern_staycation?retryWrites=true&w=majority');


var app = express();
app.use('/', indexRouter);

module.exports = app;