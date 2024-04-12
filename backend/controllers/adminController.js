const Users = require('../models/users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Party = require('../models/party');
require("dotenv").config(); // Enable access to environment variables
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Manually create admin account from the server
adminRegistration = async (firstname, lastname, username, password, pin, role, email) => {

    try {
        const existingUser = await Users.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (existingUser) {
            console.log('A user with this email or username already exists.');
            return;
        }

        // Encrypt password and pin
        const salt = await bcrypt.genSalt();
        const encryptPassword = await bcrypt.hash(password, salt);
        const encryptPIN = await bcrypt.hash(pin, salt);

        // Create admin user
        const admin = new Users({
            firstname,
            lastname,
            username,
            password: encryptPassword,
            pin: encryptPIN,
            role,
            email
        });

        // Save to database
        await admin.save();
        console.log('Admin account successfully created.', admin);
    } catch (error) {
        console.error('Error creating admin account:', error);
    }

}
// role = 4 is admin. Uncomment next line when you need to create an admin account
// adminRegistration('Roland', 'Ogundipe', 'roland.ogundipe', 'Password123!', '123456', 4, 'roland.ogundipe@yopmail.com' )

// Admin login api
exports.adminLogin = async (req, res) => {
    try {
        const { username, password, pin } = req.body;
        const user = await Users.findOne({ username });
        if (!user) return res.status(200).json({ success: false, message: "User not found" });
        const getEncryptedPassword = user.password
        const getEncryptedPin = user.pin
        const isPasswordMatch = await bcrypt.compare(password, getEncryptedPassword)
        const isPinMatch = await bcrypt.compare(pin, getEncryptedPin)
        if (!isPinMatch) return res.status(409).json({ success: false, message: "PIN is not correct" });
        if (!isPasswordMatch) return res.status(409).json({ success: false, message: "Invalid credentials" });
        
        // Relative path for user redirection
        const adminDashboardUrl = `/admin/admin-dashboard.html`;
        const errorUrl = '/error.html';
        // Convert userdata to plain object and delete password and pin field before sending the data to admin user
        const userInfoNoPasswordAndPin = user.toObject();
        delete userInfoNoPasswordAndPin.password;
        delete userInfoNoPasswordAndPin.pin;

        if (user.role === 4) {
            // Email is valid, then generate a login token with jwt and save it to the cookie
            const token = await jwt.sign( userInfoNoPasswordAndPin, process.env.SECRETJWT, { expiresIn: '1h'});
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/' });
            return res.json({ success: true, path: adminDashboardUrl, role: user.role, token, message: "Login successful. Redirecting to Admin dashboard" });
        } else if (user.role === 3) {
            const token = await jwt.sign( userInfoNoPasswordAndPin, process.env.SECRETJWT, { expiresIn: '1h'});
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/' });
            return res.json({ success: true, path: adminDashboardUrl, role: user.role, token, message: "Login successful. Redirecting to Admin dashboard"  });
        } else {
            return res.status(401).json({ success: false, path: errorUrl, message: "Unauthorized access" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred during login" });
    }
}

// Authorize admin to their page
exports.goToAdminDashboard = async (req, res) => {
    if (!req.auth) {
        return res.status(401).json({ message: 'No authorization token found' });
    }
    // console.log(req.auth)
    const userId = req.auth._id;
    
    const user = await Users.findById(userId);
    const userInfoNoPasswordAndPin = user.toObject();
    delete userInfoNoPasswordAndPin.password;
    delete userInfoNoPasswordAndPin.pin;
    if (!user) return res.status(404).json({ message: 'User not found.', success: false });

    res.json({ userInfo: userInfoNoPasswordAndPin, message: 'Accessing user dashboard', success: true })
};

// Get all registered users with role equal to 5
exports.getAllUsersWithRole5 = async (req, res) => {
    try {
        const users = await Users.find({ role: 5 });
        if (!users || users.length === 0) return res.status(200).json({ message: 'User not found.', success: false });

        res.json({ usersInfo: users, message: 'Users retrieved successfully', success: true });
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
      }
}



// MULTER configuration for file storage
// Helper function to sanitize file name
function sanitizeFileName(filename) {
    // This removes non-word characters (anything except numbers and letters) and replace spaces with hyphens.
    return filename.replace(/\s/g, '-').replace(/[^\w.-]+/g, '');
}

let uploadedFiles = []; // Empty variable to store each file path for potential deletion when data is not stored in the database
const storage = multer.diskStorage({ // Configure custom file name
    destination: function (req, file, cb) {
      cb(null, 'uploads/partyLogo')
    },
    filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Path.extname to get the original file extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000);
    const filename = sanitizeFileName(file.originalname.replace(ext, '')) + file.fieldname + '-' + uniqueSuffix;
    uploadedFiles.push(`uploads/partyLogo/${filename}`); // Store each file path for potential deletion when data is not stored in the database
    cb(null, filename)
    }
});
  
const upload = multer({ storage: storage }).fields([{ name: 'partyLogo', maxCount: 1 }, { name: 'partyLogo', maxCount: 1 }]);

// Add Party to the database logic
exports.addParty = async (req, res, next) => {
        // Multer library to add or remove file depending on if party is added successfully to db
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed', success: false });
        }
        // console.log(uploadedFiles)
        // Validate form fields
        if (!req.body.partyName || !req.body.partyAcronym || !req.files) {
            uploadedFiles.forEach(filePath => { // Do not save file path inside the uploads/partyLogo directory
                fs.unlink(filePath, unlinkErr => {
                    if (unlinkErr) {
                        console.error(`File ${filePath} not saved!`);
                    }
                });
            });
            uploadedFiles = [];  // Clear uploadedFiles array after handling error
            return res.status(409).json({ message: 'All fields are required', success: false });
        };
        try {
            // Create new party entry using the Party model
            const newParty = new Party({
                name: req.body.partyName,
                partyAcronym: req.body.partyAcronym,
                partyLogo: req.files["partyLogo"] ? req.files["partyLogo"][0].path : ''
            });
            await newParty.save(); // Save to the database
            uploadedFiles = []; // Clear uploadedFiles array after saving to the database
            return res.status(201).json({ message: "Party successfully registered", success: true, newParty });
        } catch (error) {
            uploadedFiles.forEach(filePath => { // Do not save file path inside the uploads/partyLogo directory
                fs.unlink(filePath, unlinkErr => {
                    if (unlinkErr) {
                        console.error(`File ${filePath} not saved!`);
                    }
                });
            });
            uploadedFiles = [];  // Clear uploadedFiles array after handling error
            let errorMessage;
            if (error.code == 11000) {
                errorMessage = "Party Name or Party Acronyms already exist!"
                return res.status(409).json({ message: errorMessage, success: false });
            } else {
                return res.status(500).json({ message: 'Error saving party! Please try again', success: false });
            }
        }
    })
}