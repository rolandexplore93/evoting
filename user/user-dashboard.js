const main = document.getElementsByClassName('main-content')[0];
const modal = document.getElementsByClassName('modal')[0];
const verifyEmailContent = document.getElementById('verify-email-content');
const verifyEmailSuccess = document.getElementById('verify-email-success');
const verifyEmailError = document.getElementById('verify-email-error');
const verifyPhoneContent = document.getElementById('verify-phone-content');
const verifyPhonenoSuccess = document.getElementById('verify-phoneno-success');
const verifyPhonenoError = document.getElementById('verify-phoneno-error');
const verifyEmailOTP = document.getElementById('verify-email-otp');
const verifyPhoneOTP = document.getElementById('verify-phone-otp');

function verifyEmail() {
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'block';
}

// emailotp enter code
verifyEmailOTP.onclick = function() {
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'none';
    verifyEmailSuccess.style.display = 'block';
}

//emailotp error
verifyEmailOTP.onclick = function() {
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'none';
    verifyEmailError.style.display = 'block';
}

//emailotp success done
document.getElementById('otp-email-success').onclick = function(){
    modal.style.display = 'none';
    verifyEmailContent.style.display = 'none';
    verifyEmailSuccess.style.display = 'none';
}

//emailotp error try again
document.getElementById('otp-email-error').onclick = function(){
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'block';
    verifyEmailError.style.display = 'none';
}

//emailotp error cancel page
document.getElementById('go-to-dashboard').onclick = function(){
    modal.style.display = 'none';
    verifyEmailContent.style.display = 'none';
    verifyEmailError.style.display = 'none';
}

function verifyPhoneNumber() {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'block';
}

// phoneno enter code
verifyPhoneOTP.onclick = function() {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoSuccess.style.display = 'block';
}

//phoneno otp error
verifyPhoneOTP.onclick = function() {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoError.style.display = 'block';
}

// phoneno success done
document.getElementById('otp-phone-success').onclick = function(){
    modal.style.display = 'none';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoSuccess.style.display = 'none';
}

//phoneno otp error try again
document.getElementById('otp-phone-error').onclick = function(){
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'block';
    verifyPhonenoError.style.display = 'none';
}

//phoneno otp error cancel page
document.getElementById('go-to-dashboard-now').onclick = function(){
    modal.style.display = 'none';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoError.style.display = 'none';
}

// Tab functionality
function openTab(e, tabTitle){
    var index, tabContent, tabLinks;

    tabContent = document.getElementsByClassName('tabcontent');
    for (index = 0; index < tabContent.length; index++) {
        tabContent[index].style.display = 'none';
    }

    tabLinks = document.getElementsByClassName('tablinks');
    for (index = 0; index < tabLinks.length; index++) {
        tabLinks[index].className = tabLinks[index].className.replace(" active", "");
    }

    document.getElementById(tabTitle).style.display = 'block';
    e.currentTarget.className += " active";
}

document.getElementById('defaultPage').click()

// Copy VOTING ID 
function clickToCopyVotingId() {
    const copyValue = document.getElementById('voting-id').innerHTML;
    navigator.clipboard.writeText(copyValue);
    alert("Copied " + copyValue);
}

// Dummy data voting simulation
const voter = {
    hasVotingId: true,
    votingId: '232123213',
    hasVoted: false,
    votedElections: { 
        "General1": false,
        "General2": true, 
        "General3": false
    }
};

// Click Elections
function goToElections() {
    if (voter.hasVotingId) {
        showStep('nevs-choose-language')
    } else {
        showStep('nevs-profile-not-verified')
    }
}

// Profile is not verified, go back to election page
function goToElectionPage() {
    showStep('nevs-start-election-page')
}

//After choosing a language, enter Voting ID
function enterVotingId() {
    showStep('nevs-enter-voting-id')
}

// Validate Voting ID
function validateVotingId() {
    var enteredVotingId = document.getElementById('votingID').value;

    if (enteredVotingId == voter.votingId) {
        showStep('nevs-election-conditions')
    } else {
        showStep('nevs-voting-id-not-valid')
    }
}

// Voting ID is not correct, go back to election page
function goToElectionPage() {
    showStep('nevs-start-election-page')
}
// Voting ID is not correct, enter voting ID again
function ReEnterVotingId() {
    showStep('nevs-enter-voting-id')
}

// Checkbox confirmation: Agree to conditions and start voting
document.getElementById('agreeConditions').addEventListener('change', function(){
    document.getElementById('startVoting').disabled = !this.checked;
});

// Select election activities
function startVoting(){
    showStep('nevs-select-election')
};

// Select election to participate in
function confirmElection() {
    var electionSelected = document.getElementById('electionSelection').value;
    console.log(electionSelected)
    handleElectionSelection(electionSelected);
}

// Check if user has already voted in this election
function handleElectionSelection(electionSelected) {
    if (voter.votedElections[electionSelected]) {
        showStep('nevs-voter-already-voted')
    } else {
        if (electionSelected == 'General1') {
            showStep('nevs-PRESIDENT') // Open Presidential election
        }
    }
};

// Vote for President
function voteCandidate () {
    showStep('nevs-confirm-vote');
}

function changeVote () {
    showStep('nevs-PRESIDENT');
}

function goToNextElection () {
    showStep('nevs-SENATE');
}

// Vote of Senate
function voteCandidateSen () {
    showStep('nevs-confirm-vote-sen');
}

function changeVoteSen () {
    showStep('nevs-SENATE');
}

function votingCompleted() {
    showStep('nevs-voting-successful')
}

function goToDashboard() {
    window.location = '/user/user-dashboard.html';
}

function goToResults() {
    window.location = '/election-results/electionresults.html';
}

function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('div[id^="nevs-"]').forEach((div) => {
        div.style.display = 'none';
    });

    // Show the targeted step
    document.getElementById(stepId).style.display = 'block';
}