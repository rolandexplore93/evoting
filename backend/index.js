var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var createError = require('http-errors')
require('dotenv').config()
var validator = require('validator');


var app = express()
 
// Middleware and cors
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res, next) => {
    res.json({ message: 'This is the backend development for evoting application'})
});

app.use(async(req, res, next) => {
    next(createError.NotFound('This page does not exist'))
});

app.use((err, req, res, nex) => {
    res.status(err.status || 500);
    res.json({
        error: err.message,
        status: err.status || 500,
        success: false
    })
})