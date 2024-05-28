const express = require('express'); // Import express framework
const adminRouter = express.Router(); // Configure express Router
const { adminLogin, goToAdminDashboard, getAllUsersWithRole5, addParty, createElection, getAllElectionsAndParties, 
addPartiesToElection, getElectionsAndParticipatingParties, addCandidateToElectionAndParty, voterApproval, 
getElectionsWithPartiesAndCandidates, voteSubmission, getAllVotes, updateVoteStatus, getElectionsWithPartiesAndCandidatesInfo, 
getAllApprovedVotes, 
getAllUsersWithRole5Pagination} = require('../controllers/adminController'); // Import functions from admin controller file
require('../controllers/updateSchemaController'); // import updateSchemaController

adminRouter.post('/adminLogin', adminLogin);
adminRouter.get('/adminDashboard', goToAdminDashboard);
// adminRouter.get('/allVoterUsersWithRole5', getAllUsersWithRole5Pagination) //getAllUsersWithRole5
adminRouter.get('/allVoterUsersWithRole5', getAllUsersWithRole5)
// /getAllUsersWithRole5Pagination?page=${page}&limit=${limit}
adminRouter.get('/getAllUsersWithRole5Pagination', getAllUsersWithRole5Pagination) //getAllUsersWithRole5Pagination
adminRouter.post('/addParty', addParty)
adminRouter.post('/createElection', createElection)
adminRouter.get('/getAllElectionsAndParties', getAllElectionsAndParties);
adminRouter.post('/addPartiesToElection', addPartiesToElection)
adminRouter.get('/getElectionsAndParticipatingParties', getElectionsAndParticipatingParties);
adminRouter.get('/getElectionsWithPartiesAndCandidates', getElectionsWithPartiesAndCandidates);
adminRouter.post('/addCandidateToElectionAndParty', addCandidateToElectionAndParty);
adminRouter.post('/updateVoterStatus', voterApproval);
adminRouter.post('/voteSubmission', voteSubmission);
adminRouter.get('/getAllVotes', getAllVotes)
adminRouter.post('/updateVoteStatus', updateVoteStatus); 
adminRouter.get('/getElectionsWithPartiesAndCandidatesInfo', getElectionsWithPartiesAndCandidatesInfo);
adminRouter.post('/approvedVotes', getAllApprovedVotes);

module.exports = adminRouter;