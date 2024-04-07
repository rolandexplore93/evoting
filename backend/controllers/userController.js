var createError = require('http-errors');
const naijaFaker = require("naija-faker");
const { states, stateLGA } = require('../nigerianStates');
const Users = require('../models/users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Enable access to environment variables
const nodemailer = require('nodemailer');



// Verify NIN and and return user information to the frontend for user to register on the evoting system
exports.validateNIN = async (req, res, next) => {
    const nin = req.body.ninDigit;
    console.log(nin)
    try {
        // Check if NIN exists in the Users db
        const existingUserWithNIN = await Users.findOne({ ninNumber: nin });
        if (existingUserWithNIN) {
            return res.status(201).json({ message: 'NIN already exists. Please enter correct NIN number.', success: false });
        }

        let uniqueUserInfo = false;
        let userData;

        while (!uniqueUserInfo) {
            const naijaPersonInfo = naijaFaker.getPersonList({ amt: 1 });
            const username = `${naijaPersonInfo[0].fName}.${naijaPersonInfo[0].lName}`;
            // const username = `olatunde.peaces`; // for testing before live
            const email = `${naijaPersonInfo[0].fName}.${naijaPersonInfo[0].lName}@yopmail.com`;
            const phoneNumber = `${naijaPersonInfo[0].phoneNumber}`;

            // Check if username, email, or phoneNumber exists
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
                    lga: assignLGAtoUser(userStateOfOrigin),
                    nin
                };   
            }
            
        }

        res.json({userData, message: 'NIN Verified! User information retrieved', success: true})
    } catch (error) {
        next(error)
    }
}

// Use user state of origin from naijaFaker API to assign random LGA to user
assignLGAtoUser = (userState) => {
    try {
        // Format state input such that the first letter of each word is capitalize 
        const formatStateString = userState.toLowerCase()
        .split(' ') // Split state string into array
        .map(eachWord => eachWord.charAt(0).toUpperCase() + eachWord.substring(1)) // Capitalize the first letter of each word
        .join(' ').trim()
        const lgas = stateLGA[formatStateString];
        if (!lgas) {
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
                return res.status(409).json({ message: "NIN already exists" });
            } else if (existingUser.email === req.body.email) {
                return res.status(409).json({ message: "Email already exists" });
            } else if (existingUser.phonenumber === req.body.phonenumber) {
                return res.status(409).json({ message: "Phone number already exists" });
            }
        }
        
        const dob = req.body.dateOfBirth;
        const password = req.body.password.trim();

        const salt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash(password, salt);

        const result = await bcrypt.compare(password, encryptedPassword);
        // console.log('Hash:', encryptedPassword);
        // console.log('Comparison result:', result);
        
        const age = calculateAge(dob);
        firstname = `${req.body.firstname[0].toUpperCase()}${req.body.firstname.slice(1)}`;
        lastname = `${req.body.lastname[0].toUpperCase()}${req.body.lastname.slice(1)}`;
        // If no existing user, create new user
        const newUser = new Users({
            ...req.body,
            firstname,
            lastname,
            age,
            password: encryptedPassword,
            uploadID: req.files["uploadID"] ? req.files["uploadID"][0].path : '',
            uploadSelfie: req.files["uploadSelfie"] ? req.files["uploadSelfie"][0].path : ''
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: "User successfully registered", newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred during registration" });
    }
}

function calculateAge(dob) {
    // if birthDate is a string, convert it to a Date object
    if (typeof dob === 'string') {
        dob = new Date(dob);
    }
    // Ensure dob is a Date object
    if (!(dob instanceof Date) || isNaN(dob)) {
        throw new Error('Invalid date');
    }
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dob.getFullYear();
    const m = currentDate.getMonth() - dob.getMonth();

    // If dob is yet to come in the current year, adjust the age
    if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });
        if (!user) return res.status(200).json({ success: false, message: "User not found" });
        const hash = user.password
        const isPasswordMatch = await bcrypt.compare(password, hash)
        
        if (!isPasswordMatch) return res.status(409).json({ success: false, message: "Invalid credentials" });
        
        // Relative path for user redirection
        const userDashboardUrl = `/user/user-dashboard.html`;
        const adminDashboardUrl = `/admin/admin-dashboard.html`;
        const errorUrl = '/error.html';
        // Convert userdata to plain object and 
        //delete password field before sending the remaining data to user
        const userInfoNoPassword = user.toObject();
        delete userInfoNoPassword.password;

        if (user.role === 5) {
            // Email is valid, then generate a login token with jwt and save it to the cookie
            const token = await jwt.sign( userInfoNoPassword, process.env.SECRETJWT, { expiresIn: '5m'});
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/' });
            return res.json({ success: true, path: userDashboardUrl, role: user.role, token, message: "Login successful. Redirecting to User dashboard" });
        } else if (user.role === 4) {
            const token = await jwt.sign( userInfoNoPassword, process.env.SECRETJWT, { expiresIn: '5m'});
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/' });
            return res.json({ success: true, path: adminDashboardUrl, role: user.role, token, message: "Login successful. Redirecting to Admin dashboard"  });
        } else {
            return res.status(401).json({ success: false, path: errorUrl, message: "Unauthorized access" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred during login" });
        
    }
}

exports.goToUserDashboard = async (req, res) => {
    if (!req.auth) {
        return res.status(401).json({ message: 'No authorization token found' });
    }
    // console.log(req.auth)
    const userId = req.auth._id;

    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.', success: false });

    res.json({ userInfo: user, message: 'Accessing user dashboard', success: true })
}


// Generate Random 6 digits for OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
// OTP Expires in 15 mins
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
// emailSender('roland.oguns@yopmail.com', '324562', 'NEVS', 'ELECTION')

exports.emailOTP = async (req, res) => {
    const  {_id, firstname, lastname, email } = req.body;
    const user = await Users.findById(_id);
    if (!user) return res.status(404).json({ message: 'User not found', success: false });

    // if user has otp and it hasn't expired, remind user, otherwise, send new otp to user
    if (user.emailOTP && user.emailOtpCreatedAt && !otpHasExpired(user.emailOtpCreatedAt)) {
        return res.json({ message: 'You still have active OTP. Please check your email for the last OTP received.', success: false });
    } else {
        const otp = generateOTP(); // Generate otp code
        await Users.updateOne({ _id }, { emailOTP: otp, emailOtpCreatedAt: new Date() }); // Save user otp and time  in the database
        await emailSender(email, otp, firstname, lastname); // Send email with OTP to user's email address
        return res.json({ message: 'Enter the verification code sent to your email.', success: true });
    }
}

exports.verifyEmailOTP = async (req, res) => {
    const { _id, otp, email } = req.body;
    const user = await Users.findById(_id);
    if (!user) return res.status(404).json({ message: 'User not found.', success: false });

    if (otpHasExpired(user.emailOtpCreatedAt)) {
        await Users.updateOne({ _id }, { emailOTP: '', emailOtpCreatedAt: null });
        return res.status(410).json({ message: 'OTP has expired. Please request a new one.', success: false, nextStep: 'expired' });
    }

    if (user.emailOTP === otp && user.email === email) {
        await Users.updateOne({ _id }, { isEmailVerified: true, emailOTP: '', emailOtpCreatedAt: null });
        res.json({ success: true, message: 'Email verified successfully', nextStep: 'correct' });
    } else {
        res.json({ success: false, message: 'Email verification code is incorrect', nextStep: 'incorrect' });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token'); // Clear authentication cookie
    // res.redirect('/user/user.html')
    res.json({ message: "Logged out successfully", success: true })
}





