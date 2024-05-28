const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
require("dotenv").config();
const multer = require('multer');
const path = require('path'); // Node.js utility to handle and manipulate file system paths
const fs = require('fs'); // Node.js utility for file system
const Users = require('../models/users');
const Party = require('../models/party');
const Election = require('../models/elections');   
const Candidates = require("../models/candidates");
const Vote = require("../models/vote");

// Manual creation of admin account from the backend
// Complete line 46 and uncomment the method()to create a new admin account. Once done, comment the code
adminRegistration = async (firstname, lastname, username, password, pin, role, email) => {
    try {
        const existingUser = await Users.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log('A user with this email or username already exists.');
            return;
        };
        // Encrypt admin password and pin using bcrypt security mechanism
        const salt = await bcrypt.genSalt();
        const encryptPassword = await bcrypt.hash(password, salt);
        const encryptPIN = await bcrypt.hash(pin, salt);
        // Create admin user using the Users model
        const admin = new Users({
            firstname,
            lastname,
            username,
            password: encryptPassword,
            pin: encryptPIN,
            role, // role = 3 and 4 are for admin.
            email,
        });
        await admin.save(); // Save to database
        console.log('Admin account successfully created.');
    } catch (error) {
        console.error('Error creating admin account:', error);
    };
};
// adminRegistration('Festus', 'Banks', 'festus.banks', 'Password123!', '123456', 3, 'festus.banks@yopmail.com' )

// Admin login functionality
exports.adminLogin = async (req, res) => {
    try {
        const { username, password, pin } = req.body;
        const user = await Users.findOne({ username });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        const getEncryptedPassword = user.password;
        const getEncryptedPin = user.pin;

        // Using bycrpt.compare to check if the password submitted is the same as password in the database
        const isPasswordMatch = await bcrypt.compare(password, getEncryptedPassword);
        const isPinMatch = await bcrypt.compare(pin, getEncryptedPin);
        if (!isPinMatch) return res.status(409).json({ success: false, message: "PIN is not correct" });
        if (!isPasswordMatch) return res.status(409).json({ success: false, message: "Invalid credentials" });

        const adminDashboardUrl = `/admin/admin-dashboard.html`; // Relative path for admin user redirection
        const errorUrl = '/error.html'; // path to error page
        
        // If user role is 3 or 4, redirect user to the admin dashboard. Otherwise, redirect to the error page
        if (user.role === 3 || user.role === 4 ) {
            // Generate login token with jwt and save it to the cookie
            const token = await jwt.sign({ userId: user._id, role: user.role }, process.env.SECRETJWT, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/' });
            return res.json({ success: true, path: adminDashboardUrl, role: user.role, token, message: "Login successful. Redirecting to Admin dashboard" });
        } else {
            return res.status(401).json({ success: false, path: errorUrl, message: "You are not unauthorized to access this page." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred during login" });
    };
};

// Function to authorize admin to their page
exports.goToAdminDashboard = async (req, res) => {
    // Confirm the token stored inside the cookies
    if (!req.auth) { return res.status(401).json({ message: 'No authorization token was found' })};
    const userId = req.auth.userId;
    const userRole = req.auth.role;
    if (userRole !== 3 && userRole !== 4) return res.status(404).json({ message: 'Unauthorized Access!', success: false });
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.', success: false });
    // Convert admin user data to plain object and delete password and pin field before sending the data to admin dashboard
    const userInfoNoPasswordAndPin = user.toObject();
    delete userInfoNoPasswordAndPin.password;
    delete userInfoNoPasswordAndPin.pin;
    res.json({ userInfo: userInfoNoPasswordAndPin, message: 'Accessing user dashboard', success: true });
};

// Get all registered users with role equal to 5 (voters account has a role of 5)
exports.getAllUsersWithRole5Pagination = async (req, res) => {
    if (!req.auth) { return res.status(401).json({ message: 'No authorization token found' })};
    const userRole = req.auth.role;
    if (userRole !== 3 && userRole !== 4) { return res.status(401).json({ message: 'You are not authorized to access this route.' })};
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);
    // Validate the page and limit parameters
    if (isNaN(page) || page <= 0) page = 1;
    if (isNaN(limit) || limit <= 0) limit = 10;
    const skip = (page - 1) * limit; // Skip the data fetched in previous pages

    try {
        // If you are sorting by a field (e.g firstname), ensure index on this field. - limit().sort({ firstname: 1})
        // await Users.createIndexes({ lastname: 1 });
        const voters = await Users.find({ role: 5 }).skip(skip).limit(limit);
        if (!voters || voters.length === 0) return res.status(400).json({ message: 'No voter registered yet.', success: false });
        const totalNumberOfVoters = await Users.find({ role: 5 }).countDocuments();
        const totalPages = Math.ceil(totalNumberOfVoters / limit);
        const usersInfo = voters.map(voter => {
            const userObj = voter.toObject();
            delete userObj.password;
            delete userObj.pin;
            return userObj;
        });
        res.status(200).json({ message: 'Voters retrieved successfully', success: true, totalNumberOfVoters, totalPages, currentPage: page, usersInfo })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsersWithRole5 = async (req, res) => {
    if (!req.auth) { return res.status(401).json({ message: 'No authorization token found' })};
    const userRole = req.auth.role;
    if (userRole !== 3 && userRole !== 4) { return res.status(401).json({ message: 'You are not authorized to access this route.' })};
    try {
        const users = await Users.find({ role: 5 });
        if (!users || users.length === 0) return res.status(400).json({ message: 'No user registered yet.', success: false });
        // Map over users and convert each to a plain JavaScript object and remove password and pin before sending to the frontend
        const usersInfo = users.map(user => {
            const userObj = user.toObject();
            delete userObj.password;
            delete userObj.pin;
            return userObj;
        });
        res.status(200).json({ usersInfo, message: 'Users retrieved successfully', success: true });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: "Server error"});
    };
};

// MULTER configuration for file storage
// Helper function to sanitize file name
function sanitizeFileName(filename) {
    // This removes non-word characters (anything except numbers and letters) and replace spaces with hyphens.
    return filename.replace(/\s/g, '-').replace(/[^\w.-]+/g, '');
}

let uploadedFiles = []; // Empty variable to store each file path for potential deletion when data is not stored in the database

// Configure custom file name for party logo upload
const storage = multer.diskStorage({ 
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

// Configure custom file name for candidate photo upload
const candidatePhotoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/candidateImage')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Path.extname to get the original file extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000);
        const filename = sanitizeFileName(file.originalname.replace(ext, '')) + file.fieldname + '-' + uniqueSuffix;
        uploadedFiles.push(`uploads/candidateImage/${filename}`); // Store each file path for potential deletion when data is not stored in the database
        cb(null, filename)
    }
});
// Initialize partyLogo and candidateImage multer functionality
const upload = multer({ storage: storage }).fields([{ name: 'partyLogo', maxCount: 1 }, { name: 'partyLogo', maxCount: 1 }]);
const candidateUpload = multer({ storage: candidatePhotoStorage }).fields([{ name: 'candidateImage', maxCount: 1 }, { name: 'candidateImage', maxCount: 1 }]);

// Function to Add Party to the database
exports.addParty = async (req, res, next) => {
    // Multer library to add or remove file depending on whether party is added successfully to database
    const userRole = req.auth.role;
    if (userRole !== 3) return res.status(404).json({ message: 'Unauthorized Access!', success: false });

    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed', success: false });
        }
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

// Function to save new ELECTION information to the database
exports.createElection = async (req, res) => {
    // Get submission entries from the admin
    const { electionName, electionCategory, openDate, closingDate, createdByUserId } = req.body;
    // Check that election form fields are not empty
    if (!electionName || !electionCategory || !openDate || !closingDate) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    };
    // Validate that closingDate is not before openDate
    if (new Date(closingDate) < new Date(openDate)) {
        return res.status(400).json({
            success: false,
            message: "Closing date must be after the opening date."
        });
    }
    try {
        // Check for an existing election with the same election name and category
        const existingElection = await Election.findOne({
            electionName,
            electionCategory
        });
        // Notify admin if election already exist
        if (existingElection) {
            return res.status(409).json({
                success: false,
                message: "An election with the same election category and type already exists."
            });
        }
        // Create a new election if there's no conflict
        const newElection = new Election({
            electionName,
            electionCategory,
            openDate,
            closingDate,
            createdBy: createdByUserId
        });
        await newElection.save(); // Save election to the database
        return res.status(201).json({
            success: true,
            message: "Election created successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while setting up the election."
        });
    }
}

// Get all elections and parties created
exports.getAllElectionsAndParties = async (req, res) => {
    try {
      const elections = await Election.find(); // Get all elections from database
      const parties = await Party.find(); // Get all parties from database
      res.status(200).json({ elections, parties, success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
};

// Function to add Parties To Election
exports.addPartiesToElection = async (req, res) => {
    const { electionId, selectedPartiesIds } = req.body; // Get submission entries from admin
    if (!electionId || !selectedPartiesIds) { // Validate admin submission
        return res.status(400).json({ success: false, message: 'Election ID and Party IDs are required.' });
    }
    try {
        for (const partyId of selectedPartiesIds) { // Loop through each party ID
            const party = await Party.findById(partyId); // Find each party by ID
            // If the party does not have an electionId already, update it with the new electionId
            if (party && !party.electionIds.includes(electionId)) {
                party.electionIds.push(electionId); // Add new electionId to the array of election ids
                await party.save();
            }
        }
        return res.status(200).json({ success: true, message: 'Parties added to election successfully.' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// Function to get Elections And Participating Parties
exports.getElectionsAndParticipatingParties = async (req, res) => {
    try {
        const electionInfo = await Election.aggregate([
            {
                // $lookup aggregation pipeline is used to join collections (i.e tables) together
                $lookup: {
                  from: Users.collection.name, // Target User collection
                  localField: 'createdBy', // Field from Elections collection
                  foreignField: '_id', // Field from Users collection that references Elections collection
                  as: 'creatorInfo' // Alias for the new field
                }
            },
            {
                $unwind: '$creatorInfo' // $unwind convert the array field from creatorInfo to output an object
            },
            {
              $lookup: {
                from: Party.collection.name, // Target Party collection
                localField: '_id', // Field from Election collection
                foreignField: 'electionIds', // Field from Party collection that references Election collection
                as: 'participatingParties'
              }
            },
            {
              $project: { // Data to send to the frontend
                _id: 1, // 1 in Numeric format means to include this field in the result
                electionName: 1,
                electionCategory: 1,
                createdBy: {
                    firstname: '$creatorInfo.firstname',
                    lastname: '$creatorInfo.lastname',
                },
                participatingParties: {
                    _id: 1,
                    name: 1,
                    partyAcronym: 1
                }
              }
            }
        ])
        return res.status(200).json({ success: true, message: 'Election information retrieved successfully.', electionInfo });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Could not retrieve elections!', error: error.message });
    }
}

// Function to add Candidate To Election And Party
exports.addCandidateToElectionAndParty = async (req, res) => {
    // Multer library to add or remove file depending on if candidate is added successfully to db
    candidateUpload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed', success: false });
        }
        // Validate form fields
        if (!req.body.electionId || !req.body.partyId || !req.body.candidateName  || !req.files) {
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
            // Create new candidate
            const newCandidate = new Candidates({
                candidateName: req.body.candidateName,
                // uniqueTag: req.body.uniqueTag,
                partyId: req.body.partyId,
                electionId: req.body.electionId,
                candidateImage: req.files["candidateImage"] ? req.files["candidateImage"][0].path : ''
            });
            await newCandidate.save(); // Save to the database
            uploadedFiles = []; // Clear uploadedFiles array after saving to the database
            return res.status(201).json({ message: "Candidate successfully registered", success: true, newCandidate });
        } catch (error) {
            uploadedFiles.forEach(filePath => { // Do not save file path inside the uploads/candidateImage directory
                fs.unlink(filePath, unlinkErr => {
                    if (unlinkErr) {
                        console.error(`File ${filePath} not saved!`);
                    }
                });
            });
            uploadedFiles = [];  // Clear uploadedFiles array after handling error    
            return res.status(500).json({ message: 'Error saving candidate! Please try again', success: false });
        }
    })
}

// VOTER APPROVAL: Generate random voting ID for Approved user
function generateVotingIDforUser(length) {
    let result = '';
    const characters = '01234567890123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Function to approve or rejected each voter profile when admin decide on it
exports.voterApproval = async (req, res) => {
    try {
        // Get the admin submission input from the frontend
        const { userId, selectedStatus, verifiedBy } = req.body;
        const user = await Users.findById(userId);
        // Update user collection based status (approval or rejection)
        if (selectedStatus === 'Approved') {
            // check if user merit verification requirements
            if (!user.isNINVerified)
            return res.status(400).json({ message: 'User NIN is not verified. Do not approve this user.' });
            if (!user.isphonenumberVerified)
            return res.status(400).json({ message: 'User phone number is not verified. Do not approve this user.' });
            if (!user.isEmailVerified)
            return res.status(400).json({ message: 'User email is not verified. Do not approve this user.' });
            if (!user.isDOBeligibleToVote)
            return res.status(400).json({ message: 'User is under 18 and not eligible to vote' });

            user.isIdVerified = true;
            user.profileStatus = 'Approved';
            user.isProfileVerified = true;
            user.verifiedBy = verifiedBy;
            user.verificationDate = new Date();
            user.votingID = generateVotingIDforUser(11); // Generate VOTING ID for the user
        } else if (selectedStatus === 'Rejected') {
          user.isIdVerified = false;
          user.profileStatus = 'Rejected';
          user.isProfileVerified = false;
          user.verifiedBy = verifiedBy;
          user.verificationDate = new Date();
          user.votingID = '';
        }
        await user.save(); // Save to user collection
        res.json({ message: `Status updated to ${selectedStatus}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }  
};


// Function to getElectionsWithPartiesAndCandidates
exports.getElectionsWithPartiesAndCandidates = async (req, res) => {
    try {
        const electionInfo = await Election.aggregate([
            {
                // $lookup aggregation pipeline is used to join collections (i.e tables) together
                $lookup: {
                  from: Users.collection.name, // Target User collection
                  localField: 'createdBy', // Field from Elections collection
                  foreignField: '_id', // Field from Users collection that references Elections collection
                  as: 'creatorInfo' // Alias for the new field
                }
            },
            {
                $unwind: '$creatorInfo' // $unwind convert the array field from creatorInfo to output an object
            },
            {
              $lookup: {
                from: Party.collection.name, // Target Party collection
                localField: '_id', // Field from Election collection
                foreignField: 'electionIds', // Field from Party collection that references Election collection
                as: 'participatingParties'
              }
            },
            {
                $lookup: {
                  from: Candidates.collection.name, // Target Candidates collection
                  localField: '_id',
                  foreignField: 'electionId',
                  as: 'participatingCandidates'
                }
              },
            {
              $project: { // data to send to the frontend
                _id: 1, // 1 in Numeric format means to include this field in the result
                electionName: 1,
                electionCategory: 1,
                createdBy: {
                    firstname: '$creatorInfo.firstname',
                    lastname: '$creatorInfo.lastname',
                },
                participatingParties: {
                    _id: 1,
                    name: 1,
                    partyAcronym: 1,
                    partyLogo: 1
                },
                participatingCandidates: {
                    _id: 1,
                    candidateName: 1,
                    candidateImage: 1,
                    partyId: 1
                }
              }
            }
        ])
        return res.status(200).json({ success: true, message: 'Election information retrieved successfully.', electionInfo });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Could not retrieve elections!', error: error.message });
    }
}

// Function to save each VOTE cast to the database
exports.voteSubmission = async (req, res) => {
    try {
        const { userId, electionId } = req.body; // Get userId who voted and electionId the user voted in
        // If user has already voted in this election, do not change the old vote
        const user = await Users.findById(userId);
        if (user.votedInElection.includes(electionId)) {
            return res.status(400).json({ message: 'You have already voted for this election.', status: false });
        }  
        // Find the highest voting serial number and add 1 to it to create the next serial number for vote
        const lastVote = await Vote.find().sort({ votingSerialId: -1 }).limit(1);
        const nextSerialNo = lastVote.length > 0 ? lastVote[0].votingSerialId + 1 : 1;
        // Model to create the new vote to save to the database
        const newVote = new Vote({
            ...req.body,
            votingSerialId: nextSerialNo
        });
        // Save vote to the database
        await newVote.save(); // Save vote to the database
        // After saving newvote, include the electionId inside votedInElection field in user collection
        user.votedInElection.push(electionId);
        await user.save();
        return res.status(200).json({ success: true, message: 'Vote casted successfully.' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Error saving user vote!', error: error.message });
    }
}

// Function to get all VOTES from the database
exports.getAllVotes = async (req, res) => {
    if (!req.auth) { return res.status(401).json({ message: 'No authorization token found' }); }
    // Give access to only admin to see list of all votes
    const userRole = req.auth.role;
    if (userRole !== 3 && userRole !== 4) return res.status(404).json({ message: 'Unauthorized Access!', success: false });
    try {
        const votes = await Vote.aggregate([
            {
                // $lookup aggregation pipeline is used to join collections together
                $lookup: { // Join Election collection to obtain the election details
                  from: Election.collection.name,
                  localField: 'electionId', 
                  foreignField: '_id',
                  as: 'RefElectionInfo'
                }
            },
            {
                $unwind: '$RefElectionInfo'
            },
            {
              $lookup: { // Join User collection to get details of user who voted
                from: Users.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'userWhoVoted'
              }
            },
            {
                $unwind: '$userWhoVoted'
            },
            {
              $project: { //Data to send to the frontend
                _id: 1,
                votingSerialId: 1,
                partyVotedFor: 1,
                candidateVotedFor: 1,
                voterScreenshots: 1,
                voterVideo: 1,
                voteStatus: 1,
                createdAt: 1,
                "RefElectionInfo.electionName": 1,
                "RefElectionInfo.electionCategory": 1,
                "userWhoVoted.firstname": 1,
                "userWhoVoted.lastname": 1,
                "userWhoVoted.uploadSelfie": 1,
              }
            }
        ])
        res.status(200).json({ votes, message: 'Votes retrieved successfully', success: true });
    } catch (error) {
        console.error('Error fetching votes:', error);
        res.status(500).send('Server error');
    }
}

// Function to update the status of a vote cast to approved or rejected
exports.updateVoteStatus = async (req, res) => {
    try {
        const { voteId, selectedStatus, verifiedBy } = req.body;
        const vote = await Vote.findById(voteId);
        // Update vote status based on approved or rejected)
        if (selectedStatus === 'Approved') {
            vote.voteStatus = 'Approved';
            vote.approvedBy = verifiedBy;
            vote.approvedDate = new Date();
        } else if (selectedStatus === 'Rejected') {
          vote.voteStatus = 'Rejected';
          vote.approvedBy = verifiedBy;
          vote.approvedDate = new Date();
        }
        await vote.save();
        res.json({ message: `Status updated to ${selectedStatus}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }  
};

// Election Result: Function to getElections With Parties And Candidates
exports.getElectionsWithPartiesAndCandidatesInfo = async (req, res) => {
    try {
        const electionInfo = await Election.aggregate([
            {
                // $lookup aggregation pipeline is used to join collections (i.e tables) together
                $lookup: {
                  from: Users.collection.name, // Target User collection
                  localField: 'createdBy', // Field from Elections collection
                  foreignField: '_id', // Field from Users collection that references Elections collection
                  as: 'creatorInfo' // Alias for the new field
                }
            },
            {
                $unwind: '$creatorInfo' // $unwind convert the array field from creatorInfo to output an object
            },
            {
              $lookup: {
                from: Party.collection.name, // Target Party collection
                localField: '_id', // Field from Election collection
                foreignField: 'electionIds', // Field from Party collection that references Election collection
                as: 'participatingParties'
              }
            },
            {
                $lookup: {
                  from: Candidates.collection.name, // Target Candidates collection
                  localField: '_id',
                  foreignField: 'electionId',
                  as: 'participatingCandidates'
                }
              },
            {
              $project: {
                _id: 1, // 1 in Numeric format means to include this field in the result
                electionName: 1,
                electionCategory: 1,
                participatingParties: {
                    _id: 1,
                    name: 1,
                    partyAcronym: 1,
                    partyLogo: 1
                },
                participatingCandidates: {
                    _id: 1,
                    candidateName: 1,
                    candidateImage: 1,
                    partyId: 1
                }
              }
            }
        ])
        return res.status(200).json({ success: true, message: 'Election information retrieved successfully.', electionInfo });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Could not retrieve elections!', error: error.message });
    }
}

// Get all approved votes
exports.getAllApprovedVotes = async (req, res) => {
    try {
        const { electionIdSelected } = req.body; // get the selected election ID
        const votes = await Vote.find({ electionId: electionIdSelected, voteStatus: 'Approved'});
        if (!votes || votes.length === 0) return res.status(400).json({ message: 'No vote approved yet.', success: false });
        res.status(200).json({ votes, message: 'Approved votes retrieved successfully', success: true });
    } catch (error) {
        console.error('Error fetching votes:', error);
        res.status(500).send('Server error');
    }
}
