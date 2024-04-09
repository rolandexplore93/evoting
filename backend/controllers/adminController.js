const Users = require('../models/users');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Enable access to environment variables

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
            const token = await jwt.sign( userInfoNoPasswordAndPin, process.env.SECRETJWT, { expiresIn: '30m'});
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/' });
            return res.json({ success: true, path: adminDashboardUrl, role: user.role, token, message: "Login successful. Redirecting to Admin dashboard" });
        } else if (user.role === 3) {
            const token = await jwt.sign( userInfoNoPasswordAndPin, process.env.SECRETJWT, { expiresIn: '30m'});
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

        res.json({ usersInfo: users, message: 'Users retrieved successfully', succes: true });
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
      }

}
