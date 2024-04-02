var createError = require('http-errors');
const naijaFaker = require("naija-faker");

exports.validateNIN = async (req, res, next) => {
    const nin = req.body.ninDigit;
    

    try {
        const naijaName = naijaFaker.getPersonList({ amt: 1});
        const lName = naijaName[0].lName;
        const fName = naijaName[0].fName;
        const state = naijaName[0].state;
    
        const userData = {
            firstName: `${fName[0].toUpperCase()}${fName.slice(1)}`,
            lastName: `${lName[0].toUpperCase()}${lName.slice(1)}`,
            state: state == 'fct - abuja' ? 'Abuja' : `${state[0].toUpperCase()}${state.slice(1)}`,
            username: `${naijaName[0].fName}.${naijaName[0].lName}`,
            nin
        }
        res.json({userData, message: 'User information retrieved', success: true})
        
    } catch (error) {
        next(error)
    }
}

exports.signup = async (req, res) => {
    console.log(req.body)
}
