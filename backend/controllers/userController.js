const naijaFaker = require("naija-faker"); // Import API to generate random Nigeria names
const { states, stateLGA } = require('../nigerianStates'); // Import Nigeria states and lgas list
const Users = require('../models/users'); // Import Users Model
const bcrypt = require("bcrypt");  // Import bcrypt for credential hashing and encryption
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for access token
require("dotenv").config(); // Enable access to environment variables
const nodemailer = require('nodemailer'); // Import nodemailer to send email to users' email address

// Verify NIN and and return user information to the frontend for user to register on the evoting system
exports.validateNIN = async (req, res, next) => {
    const nin = req.body.ninDigit; // Receive NIN submitted by the user from frontend
    try {
        // Check if NIN exists in the Users collection database and notify user
        const existingUserWithNIN = await Users.findOne({ ninNumber: nin });
        if (existingUserWithNIN) {
            return res.status(201).json({ message: 'NIN already exists. Please enter correct NIN number.', success: false });
        }
        let uniqueUserInfo = false; // Create uniqueUserInfo variable and Initialise it to false
        let userData; // Create uninitialise userData variable
        while (!uniqueUserInfo) {
            const naijaPersonInfo = naijaFaker.getPersonList({ amt: 1 }); // Get one random person details from naijaFaker API
            const username = `${naijaPersonInfo[0].fName}.${naijaPersonInfo[0].lName}`;
            const email = `${naijaPersonInfo[0].fName}.${naijaPersonInfo[0].lName}@yopmail.com`; // Create custom email address
            const phoneNumber = `${naijaPersonInfo[0].phoneNumber}`;

            // Check if username, email, or phoneNumber exists, then notify user
            const existingUser = await Users.findOne({ $or: [{ username }, { email }, { phoneNumber }] });
            if (!existingUser) {
                uniqueUserInfo = true;
                const fName = naijaPersonInfo[0].fName;
                const lName = naijaPersonInfo[0].lName;
                const state = naijaPersonInfo[0].state; 
                // const state = 'fct - abuja'; // for testing
                const userStateOfOrigin = state == 'fct - abuja' ? 'Abuja' : `${state[0].toUpperCase()}${state.slice(1)}`;
                userData = {
                    firstName: `${fName[0].toUpperCase()}${fName.slice(1)}`,
                    lastName: `${lName[0].toUpperCase()}${lName.slice(1)}`,
                    username,
                    email,
                    phoneNumber,
                    state: userStateOfOrigin,
                    lga: assignLGAtoUser(userStateOfOrigin), // Generate random local government area for the user
                    nin
                };   
            }
        }
        // NIN is unique, then return user information to the frontend to populate the signup form
        return res.json({userData, message: 'NIN Verified! User information retrieved', success: true})
    } catch (error) {
        next(error)
    }
}

// Use user state of origin from naijaFaker API to assign random LGA to the user
assignLGAtoUser = (userState) => {
    try {
        // Format state input such that the first letter of each word is capitalize 
        const formatStateString = userState.toLowerCase()
        .split(' ') // Split state string into array
        .map(eachWord => eachWord.charAt(0).toUpperCase() + eachWord.substring(1)) // Capitalize the first letter of each word
        .join(' ').trim() // Remove empty whitespace
        const lgas = stateLGA[formatStateString]; // Save user state into lgas variable
        if (!lgas) { //
            console.log(`LGA not found for ${formatStateString}`);
            return null
        }
        const randomIndex = Math.floor(Math.random() * lgas.length);
        return lgas[randomIndex]
    } catch (error) {
        console.log(error.message);
        return null
    }
}

// SIGNUP LOGIC: Process user registration and save it to the database
exports.signup = async (req, res) => {
    try {
        // Check for existing user with the same NIN, email, or phone number
        const existingUser = await Users.findOne({
            $or: [
                { ninNumber: req.body.ninNumber },
                { email: req.body.email },
                { phonenumber: req.body.phonenumber }
            ]
        });

        if (existingUser) {
            // Send responses to user if the details already exist
            if (existingUser.ninNumber === req.body.ninNumber) {
                return res.status(409).json({ message: "NIN already exists", success: false });
            } else if (existingUser.email === req.body.email) {
                return res.status(409).json({ message: "Email already exists", success: false });
            } else if (existingUser.phonenumber === req.body.phonenumber) {
                return res.status(409).json({ message: "Phone number already exists", success: false });
            }
        }
        
        const dob = req.body.dateOfBirth;
        const password = req.body.password;
        const salt = await bcrypt.genSalt(); // Generate bcrypt salt for password hashing
        const encryptedPassword = await bcrypt.hash(password, salt); // Encrypt user password
        const age = calculateAge(dob);
        firstname = `${req.body.firstname[0].toUpperCase()}${req.body.firstname.slice(1)}`;
        lastname = `${req.body.lastname[0].toUpperCase()}${req.body.lastname.slice(1)}`;
        const isDOBeligibleToVote = age >= 18 // Set to True if age is >= 18, otherwise, set to false
        // If no existing user, create new user
        const newUser = new Users({
            ...req.body,
            firstname,
            lastname,
            age,
            isDOBeligibleToVote,
            password: encryptedPassword,
            uploadID: req.files["uploadID"] ? req.files["uploadID"][0].path : '',
            uploadSelfie: req.files["uploadSelfie"] ? req.files["uploadSelfie"][0].path : ''
        });
        // Save the new user to the database
        await newUser.save();
        console.log({message: "User successfully registered", success: true })
        return res.status(200).json({ success: true, message: "Account created successfully. Please login and verify your email" });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "An error occurred during registration", success: false });
    }
}

// Calcuate user date of birth and check if it is less than 18 or greater than or equal to 18 
function calculateAge(dob) {
    // if birthDate is a string, convert it to a Date object
    if (typeof dob === 'string') {
        dob = new Date(dob); // Format date of birth
    }
    // Ensure dob is a Date object; throw an error
    if (!(dob instanceof Date) || isNaN(dob)) {
        throw new Error('Invalid date');
    }
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dob.getFullYear(); 
    const differentInMonth = currentDate.getMonth() - dob.getMonth();

    // If dob is yet to come in the current year, adjust the age
    if (differentInMonth < 0 || (differentInMonth === 0 && currentDate.getDate() < dob.getDate())) {
        age--;
    }
    return age; // Return exact user age
}

// LOGIN Functionality: To Authenticate and Authorize user and generate access token
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // Receive user login entries
        const user = await Users.findOne({ email }); // Check if user email exist in the database
        if (!user) return res.status(200).json({ success: false, message: "User not found" });
        const userPasswordFromDatabase = user.password; // Get user password from database
        // Compare password submitted by user with the password in the database using bcrpty.compare()
        const isPasswordMatch = await bcrypt.compare(password, userPasswordFromDatabase);
        // If Passowrd does not match
        if (!isPasswordMatch) return res.status(409).json({ success: false, message: "Invalid credentials" });
        
        // Relative path for user redirection
        const userDashboardUrl = `/user/user-dashboard.html`;
        const adminDashboardUrl = `/admin/admin-dashboard.html`;
        const errorUrl = '/error.html';
        // Convert userdata to plain object and delete password field before sending the data to the client
        const userInfoNoPassword = user.toObject();
        delete userInfoNoPassword.password;

        if (user.role === 5) {
            // Email is valid, then generate a login token with jwt and save it to the cookie
            const token = await jwt.sign( userInfoNoPassword, process.env.SECRETJWT, { expiresIn: '1h'});
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/' });
            return res.json({ success: true, path: userDashboardUrl, role: user.role, token, 
                message: "Login successful. Redirecting to User dashboard" });
        } else if (user.role === 4) {
            const token = await jwt.sign( userInfoNoPassword, process.env.SECRETJWT, { expiresIn: '5m'});
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/' });
            return res.json({ success: true, path: adminDashboardUrl, role: user.role, token, 
                message: "Login successful. Redirecting to Admin dashboard"  });
        } else {
            return res.status(401).json({ success: false, path: errorUrl, message: "Unauthorized access" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred during login" });
    }
}

// If user is authorize to the dashboard, get userId from the auth token and fetch user information from database
exports.goToUserDashboard = async (req, res) => {
    if (!req.auth) { return res.status(401).json({ message: 'No authorization token found' }) };
    const userId = req.auth._id; // Get user id from auth token
    const user = await Users.findById(userId); // Get user details from database and send the frontend
    if (!user) return res.status(404).json({ message: 'User not found.', success: false });
    // Convert userdata to plain object and delete password field before sending the data to the client
    const userInfoNoPassword = user.toObject();
    delete userInfoNoPassword.password;
    delete userInfoNoPassword.pin;
    return res.json({ userInfo: userInfoNoPassword, message: 'Accessing user dashboard', success: true })
};

// User logout functionality
exports.logout = (req, res) => {
    res.clearCookie('token'); // Clear authentication cookie
    // res.redirect('/user/user.html')
    return res.json({ message: "Logged out successfully", success: true })
}

// Generate Random 6 digits for OTP for verification purpose
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure OTP to expires in 15 mins
function otpHasExpired(emailOtpCreatedAt) {
    const expiryTime = 15 * 60 * 1000;
    return Date.now() - new Date(emailOtpCreatedAt).getTime() > expiryTime;
}

// Configure the email transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

// Configure nodemailer options for email dissemination
const emailSender = async (email, otp, firstname, lastname) => {
    const mailOptions = {
      from: 'NEVS Electoral Commission',
      to: email,
      subject: 'Email verification code',
      html: `<b>Hello ${firstname} ${lastname}!</b>
             <p>Your email verification code is: ${otp}.</p>
             <p>It will expire in 15 minutes</p>
             `,
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.log(error);
    }
}
// emailSender('roland.oguns@yopmail.com', '324562', 'NEVS', 'ELECTION') // Testing purpose

// Function to send OTP to user email address
exports.emailOTP = async (req, res) => {
    const  {_id, firstname, lastname, email } = req.body; // Get user entries from frontend
    const user = await Users.findById(_id); // Find the user
    if (!user) return res.status(404).json({ message: 'User not found', success: false });
    // if user has otp and it hasn't expired, remind user, otherwise, send new otp to user
    if (user.emailOTP && user.emailOtpCreatedAt && !otpHasExpired(user.emailOtpCreatedAt)) {
        return res.json({ message: 'You still have active OTP. Please check your email for the last OTP received.', success: false });
    } else {
        const otp = generateOTP(); // Generate otp code
        await Users.updateOne({ _id }, { emailOTP: otp, emailOtpCreatedAt: new Date() }); // Save user otp and time in the database
        await emailSender(email, otp, firstname, lastname); // Send email with OTP to user's email address
        return res.json({ message: 'Enter the verification code sent to your email.', success: true });
    }
}

// Function to verify OTP sent to user email address
exports.verifyEmailOTP = async (req, res) => {
    const { _id, otp, email } = req.body; // Get user entries from the frontend
    const user = await Users.findById(_id); // Find the user
    if (!user) return res.status(404).json({ message: 'User not found.', success: false });
    //  If OTP has expired, notify the user to request another one
    if (otpHasExpired(user.emailOtpCreatedAt)) {
        await Users.updateOne({ _id }, { emailOTP: '', emailOtpCreatedAt: null });
        return res.status(410).json({ message: 'OTP has expired. Please request a new one.', success: false, nextStep: 'expired' });
    }
    // If OTP and email submitted by user are the same as the OTP and email in the user database, verify the user email addresss
    if (user.emailOTP === otp && user.email === email) {
        await Users.updateOne({ _id }, { isEmailVerified: true, emailOTP: '', emailOtpCreatedAt: null });
        return res.json({ success: true, message: 'Email verified successfully', nextStep: 'correct' });
    } else {
        return res.json({ success: false, message: 'Email verification code is incorrect', nextStep: 'incorrect' });
    }
}







