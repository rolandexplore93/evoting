var createError = require('http-errors');
const naijaFaker = require("naija-faker");

exports.validateNIN = async (req, res) => {
    const nin = req.body.ninDigit;


    const naijaName = naijaFaker.getPersonList({ amt: 1});
    const userData = {
        firstName: naijaName[0].fName,
        lastName: naijaName[0].lName,
        state: naijaName[0].state,
        username: `${naijaName[0].fName}.${naijaName[0].lName}`,
        nin
    }
    res.json({userData, message: 'User information retrieved', success: true})
}

exports.signup = async (req, res) => {
    console.log(req.body)
}
