const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Enable access to environment variables (This file holds sensitive information that is not accessible to the public)
const Users = require('../models/users');
const Party = require('../models/party');
const Election = require('../models/elections');
const Candidates = require("../models/candidates");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Vote = require("../models/vote");

// This function for the manual creation of admin account from the backend
// Fill in admin details as arguments in line 47 and uncomment the method() when you are ready to create the admin account
adminRegistration = async (firstname, lastname, username, password, pin, role, email) => {
    try {
        // Search if admin account with this email or username already exist
        const existingUser = await Users.findOne({
            $or: [{ email: email }, { username: username }] 
        });
        if (existingUser) {
            console.log('A user with this email or username already exists.');
            return;
        };
        // Encrypt the new password and pin using bcrypt security mechanism
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
            role, // role = 4 is for admin.
            email
        });
        await admin.save(); // Save to database
        console.log('Admin account successfully created.');
    } catch (error) {
        console.error('Error creating admin account:', error);
    };
};
// adminRegistration('Roland', 'Ogundipe', 'roland.ogundipe', 'Password123!', '123456', 4, 'roland.ogundipe@yopmail.com' )

// Admin login functionality
exports.adminLogin = async (req, res) => {
    try {
        const { username, password, pin } = req.body; // Login details received from the frontend
        const user = await Users.findOne({ username }); // Search for admin in the database
        if (!user) return res.status(200).json({ success: false, message: "User not found" });
        const getEncryptedPassword = user.password;
        const getEncryptedPin = user.pin;

        // Use bycrpt.compare to check if the password submitted is the same as password in the database
        const isPasswordMatch = await bcrypt.compare(password, getEncryptedPassword);
        const isPinMatch = await bcrypt.compare(pin, getEncryptedPin);
        if (!isPinMatch) return res.status(409).json({ success: false, message: "PIN is not correct" });
        if (!isPasswordMatch) return res.status(409).json({ success: false, message: "Invalid credentials" });

        const adminDashboardUrl = `/admin/admin-dashboard.html`; // Relative path for admin user redirection
        const errorUrl = '/error.html'; // path to error page
        // Convert admin user data to plain object and delete password and pin field before sending the data to the frontend
        const userInfoNoPasswordAndPin = user.toObject();
        delete userInfoNoPasswordAndPin.password;
        delete userInfoNoPasswordAndPin.pin;
        // If user role is 4 or 3, redirect to the admin dashboard. Otherwise, redirect to the error page
        if (user.role === 4) {
            // Email is valid, then generate a login token with jwt and save it to the cookie
            const token = await jwt.sign(userInfoNoPasswordAndPin, process.env.SECRETJWT, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/' });
            return res.json({ success: true, path: adminDashboardUrl, role: user.role, token, message: "Login successful. Redirecting to Admin dashboard" });
        } else if (user.role === 3) {
            const token = await jwt.sign(userInfoNoPasswordAndPin, process.env.SECRETJWT, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/' });
            return res.json({ success: true, path: adminDashboardUrl, role: user.role, token, message: "Login successful. Redirecting to Admin dashboard" });
        } else {
            return res.status(401).json({ success: false, path: errorUrl, message: "Unauthorized access" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred during login" });
    };
};

// Function to authorize admin to their page
exports.goToAdminDashboard = async (req, res) => {
    // This check for the token stored inside the cookies
    if (!req.auth) { return res.status(401).json({ message: 'No authorization token found' })};
    const userId = req.auth._id; // If there is token, get the userId
    const user = await Users.findById(userId); // Search for the userId in the database
    if (!user) return res.status(404).json({ message: 'User not found.', success: false });
    const userInfoNoPasswordAndPin = user.toObject(); // Delete password and pin before sending the data to the admin dashboard
    delete userInfoNoPasswordAndPin.password;
    delete userInfoNoPasswordAndPin.pin;
    res.json({ userInfo: userInfoNoPasswordAndPin, message: 'Accessing user dashboard', success: true });
};

// Get all registered users with role equal to 5 (voters account has a role of 5)
exports.getAllUsersWithRole5 = async (req, res) => {
    // Check if token is present inside the cookies
    if (!req.auth) { return res.status(401).json({ message: 'No authorization token found' })};
    // Only admin with role = 4 is authorized to access this date
    if (req.auth.role !== 4) { return res.status(401).json({ message: 'You are not authorized to access this path.' })};
    try {
        const users = await Users.find({ role: 5 });
        if (!users || users.length === 0) return res.status(400).json({ message: 'User not found.', success: false });
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
        res.status(500).send('Server error');
    };
};



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

const candidatePhotoStorage = multer.diskStorage({ // Configure custom file name
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

const upload = multer({ storage: storage }).fields([{ name: 'partyLogo', maxCount: 1 }, { name: 'partyLogo', maxCount: 1 }]);
const candidateUpload = multer({ storage: candidatePhotoStorage }).fields([{ name: 'candidateImage', maxCount: 1 }, { name: 'candidateImage', maxCount: 1 }]);

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


// CREATE ELECTION API
exports.createElection = async (req, res) => {
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
      const elections = await Election.find();
      const parties = await Party.find();
      res.status(200).json({ elections, parties, success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
};

// addPartiesToElection
exports.addPartiesToElection = async (req, res) => {
    const { electionId, selectedPartiesIds } = req.body;
    if (!electionId || !selectedPartiesIds) {
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

// getElectionsAndParticipatingParties
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
              $project: {
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

// addCandidateToElectionAndParty
exports.addCandidateToElectionAndParty = async (req, res) => {
    // Multer library to add or remove file depending on if candidate is added successfully to db
    candidateUpload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed', success: false });
        }
        // Validate form fields
        if (!req.body.electionId || !req.body.partyId || !req.body.candidateName  || !req.files) { // || !req.body.uniqueTag
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
            // let errorMessage;
            // if (error.code == 11000) {
            //     errorMessage = "Candidate Tag already exist!"
            //     return res.status(409).json({ message: errorMessage, success: false });
            // } else {
                return res.status(500).json({ message: 'Error saving candidate! Please try again', success: false });
            // }
        }
    })
}

// VOTER APPROVAL
// Generate voting ID for user
function generateVotingIDforUser(length) {
    let result = '';
    const characters = '01234567890123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.voterApproval = async (req, res) => {
    try {
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
            user.votingID = generateVotingIDforUser(11);
        } else if (selectedStatus === 'Rejected') {
          user.isIdVerified = false;
          user.profileStatus = 'Rejected';
          user.isProfileVerified = false;
          user.verifiedBy = verifiedBy;
          user.verificationDate = new Date();
          user.votingID = '';
        }
        await user.save();
        res.json({ message: `Status updated to ${selectedStatus}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }  
};


// getElectionsWithPartiesAndCandidates
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
              $project: {
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

// VOTE SUBMISSION
exports.voteSubmission = async (req, res) => {
    try {

        const { userId, electionId } = req.body;

        // If user has already voted in this election, do not change the old vote
        const user = await Users.findById(userId);
        if (user.votedInElection.includes(electionId)) {
            return res.status(400).json({ message: 'You have already voted for this election.', status: false });
        }  

        // Find the highest voting serial number and add 1 to it to create the next serial number for vote
        const lastVote = await Vote.find().sort({ votingSerialId: -1 }).limit(1);
        const nextSerialNo = lastVote.length > 0 ? lastVote[0].votingSerialId + 1 : 1;

        const newVote = new Vote({
            ...req.body,
            votingSerialId: nextSerialNo
        });

        
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

// VOTES FETCHING
exports.getAllVotes = async (req, res) => {
    if (!req.auth) { return res.status(401).json({ message: 'No authorization token found' }); }
    if (req.auth.role !== 4) { return res.status(401).json({ message: 'You are not authorized to access this path.' }); }
    try {
        // const votes = await Vote.find();
        // if (!votes || votes.length === 0) return res.status(400).json({ message: 'No vote cast yet.', success: false });
        const votes = await Vote.aggregate([
            {
                // $lookup aggregation pipeline is used to join collections together
                $lookup: {
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
              $lookup: {
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
              $project: {
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

// ogetAllVotes = async (req, res) => {
//     // if (!req.auth) { return res.status(401).json({ message: 'No authorization token found' }); }
//     // if (req.auth.role !== 4) { return res.status(401).json({ message: 'You are not authorized to access this path.' }); }
//     try {
//         // const votes = await Vote.find();
//         // if (!votes || votes.length === 0) return res.status(400).json({ message: 'No vote cast yet.', success: false });
//         // console.log(votes)
//         // res.status(200).json({ votes, message: 'Votes retrieved successfully', success: true });

//         const voteInfo = await Vote.aggregate([
//             {
//                 // $lookup aggregation pipeline is used to join collections together
//                 $lookup: {
//                   from: Election.collection.name,
//                   localField: 'electionId', 
//                   foreignField: '_id',
//                   as: 'RefElectionInfo'
//                 }
//             },
//             {
//                 $unwind: '$RefElectionInfo'
//             },
//             {
//               $lookup: {
//                 from: Users.collection.name,
//                 localField: 'userId',
//                 foreignField: '_id',
//                 as: 'userWhoVoted'
//               }
//             },
//             {
//                 $unwind: '$userWhoVoted'
//             },
//             {
//               $project: {
//                 _id: 1,
//                 votingSerialId: 1,
//                 partyVotedFor: 1,
//                 candidateVotedFor: 1,
//                 voterScreenshots: 1,
//                 voterVideo: 1,
//                 voteStatus: 1,
//                 "RefElectionInfo.electionName": 1,
//                 "RefElectionInfo.electionCategory": 1,
//                 "userWhoVoted.firstname": 1,
//                 "userWhoVoted.lastname": 1,
//                 "userWhoVoted.uploadSelfie": 1,
//               }
//             }
//         ])
//         console.log(voteInfo)
//     } catch (error) {
//         console.error('Error fetching votes:', error);
//         // res.status(500).send('Server error');
//     }
// }
// ogetAllVotes()

// Election Result 
// getElectionsWithPartiesAndCandidates
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

// Fecth all approved votes
exports.getAllApprovedVotes = async (req, res) => {
    try {
        const { electionIdSelected } = req.body;
        const votes = await Vote.find({ electionId: electionIdSelected, voteStatus: 'Approved'});
        if (!votes || votes.length === 0) return res.status(400).json({ message: 'No vote approved yet.', success: false });
        res.status(200).json({ votes, message: 'Approved votes retrieved successfully', success: true });
    } catch (error) {
        console.error('Error fetching votes:', error);
        res.status(500).send('Server error');
    }
}
