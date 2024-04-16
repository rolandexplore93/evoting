const express = require('express');
const adminRouter = express.Router();
const { adminLogin, goToAdminDashboard, getAllUsersWithRole5, addParty, createElection, getAllElectionsAndParties, addPartiesToElection, getElectionsAndParticipatingParties, addCandidateToElectionAndParty, voterApproval, getElectionsWithPartiesAndCandidates } = require('../controllers/adminController');
require('../controllers/updateSchemaController');

adminRouter.post('/adminLogin', adminLogin);
adminRouter.get('/adminDashboard', goToAdminDashboard);
adminRouter.get('/allVoterUsersWithRole5', getAllUsersWithRole5)
adminRouter.post('/addParty', addParty)
adminRouter.post('/createElection', createElection)
adminRouter.get('/getAllElectionsAndParties', getAllElectionsAndParties);
adminRouter.post('/addPartiesToElection', addPartiesToElection)
adminRouter.get('/getElectionsAndParticipatingParties', getElectionsAndParticipatingParties);
adminRouter.get('/getElectionsWithPartiesAndCandidates', getElectionsWithPartiesAndCandidates);
adminRouter.post('/addCandidateToElectionAndParty', addCandidateToElectionAndParty);
adminRouter.post('/updateVoterStatus', voterApproval);


module.exports = adminRouter;




































// const multer = require('multer');
// const path = require('path');

// // MULTER: Filenames and storage location set up
// // Helper function to sanitize file name
// function sanitizeFileName(filename) {
//     // This removes non-word characters (anything except numbers and letters) and replace spaces with hyphens.
//     return filename.replace(/\s/g, '-').replace(/[^\w.-]+/g, '');
// }
  
// const storage = multer.diskStorage({ // Configure custom file name
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/partyLogo')
//     },
//     filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname); // Path.extname to get the original file extension
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000);
//     const filename = sanitizeFileName(file.originalname.replace(ext, '')) + file.fieldname + '-' + uniqueSuffix;
//     cb(null, filename)
//     }
// });
  
// const upload = multer({ storage: storage });
