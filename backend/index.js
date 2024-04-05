var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var createError = require('http-errors')
require("dotenv").config(); // Enable access to environment variables
require("./helpers/databaseConnection.js")
var validator = require('validator');
const userRouter = require('./routes/userRoutes')
var expressjwt = require("express-jwt");


var app = express(); // Instantiate express application
const port = process.env.PORT || 3000; // Setup PORT for the backend
 
// Middleware and cors
app.use(bodyParser.json());
app.use(cors());
// app.use(expressjwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'], getToken: req => req.cookies.token }));

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