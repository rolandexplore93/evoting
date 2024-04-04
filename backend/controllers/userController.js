var createError = require('http-errors');
const naijaFaker = require("naija-faker");
const { states, stateLGA } = require('../nigerianStates');
const Users = require('../models/users');
const bcrypt = require("bcrypt");

// Verify NIN and and return user information to the frontend for user to register on the evoting system
exports.validateNIN = async (req, res, next) => {
    const nin = req.body.ninDigit;
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
            } else if (existingUser.phoneNo === req.body.phonenumber) {
                return res.status(409).json({ message: "Phone number already exists" });
            }
            return
        }

        const dob = req.body.dateOfBirth
        const age = calculateAge(dob);
        // If no existing user, create new user
        const newUser = new Users({
            ...req.body,
            age,
            uploadID: req.files["uploadID"] ? req.files["uploadID"][0].path : '',
            uploadSelfie: req.files["uploadSelfie"] ? req.files["uploadSelfie"][0].path : ''
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: "User successfully registered" });
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