var createError = require('http-errors');
const naijaFaker = require("naija-faker");
const { states, stateLGA } = require('../nigerianStates');

// Verify NIN and and return user information to the frontend for user to register on the evoting system
exports.validateNIN = async (req, res, next) => {
    const nin = req.body.ninDigit;
    try {
        const naijaPersonInfo = naijaFaker.getPersonList({ amt: 1 });
        const lName = naijaPersonInfo[0].lName;
        const fName = naijaPersonInfo[0].fName;
        const state = naijaPersonInfo[0].state;
    
        const userData = {
            firstName: `${fName[0].toUpperCase()}${fName.slice(1)}`,
            lastName: `${lName[0].toUpperCase()}${lName.slice(1)}`,
            username: `${naijaPersonInfo[0].fName}.${naijaPersonInfo[0].lName}`,
            email: `${naijaPersonInfo[0].fName}.${naijaPersonInfo[0].lName}@yopmail.com`,
            phoneNumber: `${naijaPersonInfo[0].phoneNumber}`,
            state: state == 'fct - abuja' ? 'Abuja' : `${state[0].toUpperCase()}${state.slice(1)}`,
            lga: assignLGAtoUser(state),
            nin
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
    console.log(req.body)
}

