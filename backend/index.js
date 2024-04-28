var express = require('express') // Require express framework
// cors is used for security purpose to manage the access that requests from domains has to this server
var cors = require('cors');
var bodyParser = require('body-parser') // Middleware to process JSON data
var createError = require('http-errors') // Library to handle server errors
require("dotenv").config(); // Enable access to environment variables
require("./helpers/databaseConnection.js") // Initiate access to the database
var { expressjwt: jwt } = require("express-jwt"); //Middleware to secure this app by validating JWTs for authentication
var cookieParser = require('cookie-parser'); // To manage user sessions. It parses cookies attached to the client request
const path = require('path'); // Node.js utility to handle and manipulate file system paths
const userRouter = require('./routes/userRoutes') // Import the user routes APIs
const adminRouter = require('./routes/adminRoutes.js'); // Import the admin routes APIs

var app = express(); // Instantiate express application
const port = process.env.PORT || 3000; // Setup PORT for the server
 
// Middleware and cors
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5500', credentials: true }));
app.use(cookieParser())

// This function gets user token from request cookies
const getTokenFromCookie = (req) => { return req.cookies.token };

// express-jwt middleware to validate the JWT and set req.auth
// NOTE: Token credentials will not be require for path inside the unless() function
app.use(jwt({
  secret: process.env.SECRETJWT,
  algorithms: [process.env.JWTalgorithms],
  getToken: getTokenFromCookie
}).unless({ path: ['/login', '/validatenin', '/signup', '/emailOTP', '/verifyEmailOTP', '/logout',
'/adminLogin', '/getElectionsWithPartiesAndCandidatesInfo', '/approvedVotes'] }));

// Serve static images and files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Starting url for the backend
app.get('/', (req, res, next) => {
    res.json({ message: 'This is the backend development for evoting application'})
});

// Initialize routes
app.use('/', userRouter)
app.use('/', adminRouter)
// Default response when a path does not exist
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