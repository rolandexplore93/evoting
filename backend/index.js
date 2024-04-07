var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var createError = require('http-errors')
require("dotenv").config(); // Enable access to environment variables
require("./helpers/databaseConnection.js")
const userRouter = require('./routes/userRoutes')
var { expressjwt: jwt } = require("express-jwt");
var cookieParser = require('cookie-parser');
const path = require('path');

var app = express(); // Instantiate express application
const port = process.env.PORT || 3000; // Setup PORT for the backend
 
// Middleware and cors
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5500', credentials: true }));
app.use(cookieParser())

// Custom function to get the token from request cookies
const getTokenFromCookie = (req) => {
  return req.cookies.token;
};

// express-jwt middleware to validate the JWT and set req.auth
app.use(jwt({
  secret: process.env.SECRETJWT,
  algorithms: [process.env.JWTalgorithms],
  getToken: getTokenFromCookie
}).unless({ path: ['/login', '/validatenin', '/signup', '/emailOTP', '/verifyEmailOTP', '/logout'] }));

// Serve static images and files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res, next) => {
    res.json({ message: 'This is the backend development for evoting application'})
});

// Initialize routes
app.use('/', userRouter)

app.use(async(req, res, next) => {
    next(createError.NotFound('This page does not exist'))
});

app.use((err, req, res, nex) => {
    res.json({
        error: err.message,
        status: err.status || 500,
        success: false
    })
});

// Server setup
app.listen(port, console.log(`Listening to the server at port: ${port}`))