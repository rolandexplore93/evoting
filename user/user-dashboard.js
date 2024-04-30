// Get target html elements
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

let globalUserData; // uninitialized global variable to store user information
let allElectionsWithPartiesAndCandidates; // uninitialized global variable to store election information

// When user dashboard loads, make an api call to get Elections details With Parties And Candidates
// and store the data inside allElectionsWithPartiesAndCandidates variable
document.addEventListener('DOMContentLoaded', async () => {
    allElectionsWithPartiesAndCandidates = await getElectionsWithPartiesAndCandidates();
});

// FUNCTION to get all elections with participating parties and candidates from the database
const getElectionsWithPartiesAndCandidates = async () => {
    console.log('getElectionsWithPartiesAndCandidates')
    try {
        const response = await fetch('http://localhost:3000/getElectionsWithPartiesAndCandidates', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
        return data
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message)
    }
}

// Function to return user to dashboard when email verification is successful
document.getElementById('otp-email-success').onclick = function () {
    modal.style.display = 'none';
    verifyEmailContent.style.display = 'none';
    verifyEmailSuccess.style.display = 'none';
}
// Function to notify user to retry another email OTP
document.getElementById('otp-email-error').onclick = function () {
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'block';
    verifyEmailError.style.display = 'none';
}
// Function to return user to dashboard when email verification is not successful
document.getElementById('go-to-dashboard').onclick = function () {
    modal.style.display = 'none';
    verifyEmailContent.style.display = 'none';
    verifyEmailError.style.display = 'none';
}
// Function to display verify phone number form
function verifyPhoneNumber() {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'block';
}
// Function to confirm OTP is correct or not. Implementation not done yet
verifyPhoneOTP.onclick = function () {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'none';
    let success = true;
    if (success) { // Successful OTP verification
        return verifyPhonenoSuccess.style.display = 'block';
    } else { // OTP error
        return verifyPhonenoError.style.display = 'block';
    }
}
// Function to return user to dashboard when phone no verification is successful
document.getElementById('otp-phone-success').onclick = function () {
    modal.style.display = 'none';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoSuccess.style.display = 'none';
}
// Function to notify user to retry the another phone no OTP
document.getElementById('otp-phone-error').onclick = function () {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'block';
    verifyPhonenoError.style.display = 'none';
}
// Function to return user to dashboard when phone verification is not successful
document.getElementById('go-to-dashboard-now').onclick = function () {
    modal.style.display = 'none';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoError.style.display = 'none';
}

// User Dashboard Tab functionality
function openTab(e, tabTitle) {
    var index, tabContent, tabLinks;
    // Iterate over each tab content and set display to none
    tabContent = document.getElementsByClassName('tabcontent');
    for (index = 0; index < tabContent.length; index++) {
        tabContent[index].style.display = 'none';
    }
    // Iterate over each tab link and remove 'active' class from it
    tabLinks = document.getElementsByClassName('tablinks');
    for (index = 0; index < tabLinks.length; index++) {
        tabLinks[index].className = tabLinks[index].className.replace(" active", "");
    }
    // Display selected tab and apply class 'active' to it
    document.getElementById(tabTitle).style.display = 'block';
    e.currentTarget.className += " active";
};
document.getElementById('defaultPage').click(); // Set Dashboard as default tab view

// Function to Copy VOTING ID to clipboard
function clickToCopyVotingId() {
    const copyValue = document.getElementById('voting-id').innerHTML;
    navigator.clipboard.writeText(copyValue);
    document.getElementById('copy-voting-id').textContent = 'Voting ID Copied';
    document.getElementById('copy-voting-id').classList.add('copy-clipboard');
    setTimeout(() => {
        document.getElementById('copy-voting-id').classList.remove('copy-clipboard');
        document.getElementById('copy-voting-id').textContent = 'Copy Voting Id';
    }, 600)
}

// Function to Start Election when user open election tabk and clicks oon start election button
function goToElections() {
    if (globalUserData.votingID != '') { // If user has a votingId generated, open choose language form
        showStep('nevs-choose-language')
    } else {
        showStep('nevs-profile-not-verified') // No votingId? call goToElectionPage function
    }
}

// When Profile is not verified, voting id is not correct or user already voted, GO back to election page
function goToElectionPage() {
    showStep('nevs-start-election-page')
    location.reload()
}

//After choosing a language, open the enter Voting ID page
function enterVotingId() { showStep('nevs-enter-voting-id') };

// Function to Validate Voting ID
function validateVotingId() {
    var enteredVotingId = document.getElementById('votingID').value;
    console.log(enteredVotingId)

    if (enteredVotingId == globalUserData.votingID) {
        showStep('nevs-election-conditions') // Correct Voting ID? go to terms and conditions page
    } else {
        showStep('nevs-voting-id-not-valid') // alert user that voting id is not correct
    }
}

// Voting ID is not correct, prompt user to re-enter voting ID again
function ReEnterVotingId() { showStep('nevs-enter-voting-id') };

// Checkbox confirmation: Agree to conditions and start voting
document.getElementById('agreeConditions').addEventListener('change', function () {
    document.getElementById('startVoting').disabled = !this.checked;
});

// Select election activities
function startVoting() {
    showStep('nevs-select-election');
    const electionInfo = allElectionsWithPartiesAndCandidates.electionInfo
    const electionCategorySelect = document.getElementById('electionSelection');
    // `iterate for the electionInfo and populate them as <option>s inside <select>Select Election</select>
    electionInfo?.forEach(election => {
      const option = document.createElement('option');
      option.value = election._id;
      option.textContent = `${election.electionCategory} - ${election.electionName}`;
      electionCategorySelect.appendChild(option);
    });
    // Listen for changes to populate participating parties
    electionCategorySelect.addEventListener('change', (event) => {
        // const selectedElection = electionInfo.find(election => election._id === event.target.value);
        toggleCreateButton();
    });
    // Function to enable or disable the confirm election button
    function toggleCreateButton() {
        const selectedElection = electionCategorySelect.value;
        document.getElementById('confirmElection').disabled = !selectedElection;
    }
};

// Function to allow voter to select election to participate in
function confirmElection() {
    var electionSelectedId = document.getElementById('electionSelection').value; // Get election Id selected by voter
    // Check if election ID selected matches the electionId from the database
    var electionSelected = allElectionsWithPartiesAndCandidates.electionInfo?.find(election => election._id === electionSelectedId);

    // If voter has voted in selected election, notify voter that they have voted; otherwise, go the e-ballot form
    if (globalUserData.votedInElection.includes(electionSelected._id)) {
        showStep('nevs-voter-already-voted')
    } else {
        showElectionForm(electionSelected); // Display election ballot form
    }
}

// Function to display the eBallot form and populate it with participating parties and candidates
const showElectionForm = (electionSelected) => {
    const participatingParties = electionSelected.participatingParties;
    const participatingCandidates = electionSelected.participatingCandidates;
    // e-ballot HTML template rendered from the DOM
    const ballotHTML = `
        <div class="election-tab" id="nevs-${electionSelected._id}">
            <h2>${electionSelected.electionCategory} - ${electionSelected.electionName}</h2>
            <form id="${electionSelected._id}">
                <table>
                    <tr>
                        <th>Party</th>
                        <th>Party Logo</th>
                        <th>Candidate Name</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                    ${participatingParties.map(party => {
                        // Find candidate that matches the participating parties
                        const candidate = participatingCandidates.find(candidate => candidate.partyId === party._id);
                        const candidateName = candidate ? candidate.candidateName : 'No Name';
                        const candidateImage = candidate ? `<img src="http://localhost:3000/${candidate.candidateImage}" alt="${candidateName}" 
                        width="30px" height="30px">` : '<img src="/images/placeholder-image.jpeg" alt="${candidateName}" width="30px" height="30px">';
                        return `
                            <tr>
                                <td>${party.partyAcronym} - ${party.name}</td>
                                <td><img src="http://localhost:3000/${party.partyLogo}" alt="${party.name}" width="30px" height="30px"></td>
                                <td>${candidateName}</td>
                                <td>${candidateImage}</td>
                                <td><input type="radio" name="voteOption" 
                                value="${electionSelected._id}-${party._id}-${party.partyAcronym}-${candidate ? candidate._id : 'NoID'}-${candidateName}"></td>
                            </tr>
                        `;
                    }).join('')}
                </table>
                <button type="button" id="voteButton" disabled>Vote</button>
            </form>
        </div>
        <div class="election-tab" id="nevs-confirm-vote">
            <p>Confirm your vote for ${electionSelected.electionName}?</p>
            <button id="changeVote" onclick="changeVote('nevs-${electionSelected._id}')">Change Vote</button>
            <button id="confirmVote">Yes</button>
        </div>
    `;
    const displayElection = document.getElementById('nevs-selectedElection');
    displayElection.innerHTML = ballotHTML; // Render the eBallot HTML on the page

    // Call showStep() to display this e-ballot form after the html has rendered
    showStep(`nevs-${electionSelected._id}`);

    // Enable the voteButton when a user select at least one vote
    document.querySelectorAll(`[name="voteOption"]`).forEach(radio => {
        radio.addEventListener('change', (e) => {
          document.getElementById("voteButton").disabled = false;
        });
    });

    const voteCandidateButton = document.getElementById('voteButton'); 
    voteCandidateButton.addEventListener('click', voteCandidate); // Select vote button and call voteCandidate function
    // When voter confirm vote, initiate the votingCompleted() function
    const votingCompletedButton = document.getElementById('confirmVote');
    votingCompletedButton.addEventListener('click', () => {
        const voteData = document.querySelector(`[name="voteOption"]:checked`).value;
        votingCompleted(voteData)
    });
}

// Function to open vote confirmation card
function voteCandidate() {
    showStep('nevs-confirm-vote');
}

// When voter opts to change their votes, reopen the eBallot form
function changeVote(stepTag) {
    showStep(stepTag);
}

// Send vote cast to the server api
async function votingCompleted(voteData) {
    // Retrieve votes information cast by voter and send to the server API to record user vote
    const userVote = voteData.split('-');
    const electionId = userVote[0];
    const partyId = userVote[1];
    const partyVotedFor = userVote[2];
    const candidateId = userVote[3];
    const candidateVotedFor = userVote[4];
    const userId = globalUserData._id;

    try {
        const response = await fetch('http://localhost:3000/voteSubmission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ electionId, partyId, partyVotedFor, candidateId, candidateVotedFor, userId}),
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
        const data = await response.json();
        showStep('nevs-voting-successful')
    } catch (error) {
        console.error('Error saving user vote');
        alert('Error saving user vote');
    }
}

// Redirect voter to dashboard after successful voting
function goToDashboard() {
    window.location = '/user/user-dashboard.html';
}

// Redirect voter to election results page when voter clicks on see results
function goToResults() {
    window.location = '/election-results/electionresults.html';
}

// Election voting process using Javascript STEP to open card by card
function showStep(stepId) {
    document.querySelectorAll('div[id^="nevs-"]').forEach((div) => {
        div.style.display = 'none'; // Hide all steps
    });

    // Show the targeted step
    const step = document.getElementById(stepId);
    const ballotFormContainer = document.getElementById('nevs-selectedElection');

    if (step && ballotFormContainer) { // Display selected step if it's the election
        ballotFormContainer.style.display = 'block'; 
        step.style.display = 'block';
    } else {
        document.getElementById(stepId).style.display = 'block'; // Display selected step
    }
}

// When a user is authorize to their page, fetch userdata on the page load
document.addEventListener('DOMContentLoaded', async () => {
    getUserData();
});

// Function to fetch user data from the database when the user is authorized to the dashboard
const getUserData = async () => {
    const userDashboard = document.getElementById('user-dashboard');
    try {
        const response = await fetch('http://localhost:3000/userDashboard', {
            method: 'GET',
            credentials: 'include'
        });
        const data =  await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Authorization failed');
        }
        // When user is not authorised, redirect user to login page
        if (data.error === "No authorization token was found") {
            alert('Unauthorized! Please login to access this page')
            window.location.href = '/user/user.html';
            return
        }
        // When login token expires, redirect user to login page
        if (data.error === "jwt expired") {
            alert('Session expired! Please login again')
            window.location.href = '/user/user.html';
            return
        }
        const userData = data.userInfo;
        globalUserData = userData; // Save userData to globalUserData to be accessible outside this function
        userDashboard.style.display = 'flex'
        populateUserData(userData) // Call populateUserData() function
    } catch (error) {
        console.error('Error:', error);
        alert('Not Authorized to access this page! Please login')
        window.location.href = '/user/user.html';
    }
}

// Display user data on the dashboard using the string literals from the DOM
function populateUserData(userData) {
    function convertISOdateToHtmlFormat(isoDateString) {
        const date = new Date(isoDateString);
        return date.toISOString().split('T')[0];
    }
    const dob = userData.dateOfBirth 
    const formatedDOB = convertISOdateToHtmlFormat(dob)
    const userSiderbar = document.getElementById('sidebar');
    const votingIdTable = document.getElementById('votingIdTable');
    userSiderbar.innerHTML = `
    <p>Welcome ${userData.firstname}</p>
    <div>
        <p>Profile photo</p>
        <img src="http://localhost:3000/${userData.uploadSelfie}" alt="selfie-image" width="90%" height="150px">
    </div>
    <div>
        <p>ID CARD</p>
        <img src="http://localhost:3000/${userData.uploadID}" alt="selfie-image" width="200px" height="200px">
        <span class="verified">${userData.isIdVerified ? '&#10004' : '&#8987'}</span>
    </div>
    <div class="user-details">
        <p>NIN: <input type="text" name="" id="" value="${userData.ninNumber}" disabled> <span
                class="verified">${userData.isNINVerified ? '&#10004' : '&#8987'}</span></p>
        <div>
            <p>Surname: <input type="text" name="" id="" value="${userData.lastname}" disabled></p>
            <p>Firstname: <input type="text" name="" id="" value="${userData.firstname}" disabled></p>
        </div>
        <div>
            <p>Username: <input type="text" name="" id="" value="${userData.username}" disabled></p>
            <p>Gender: <input type="text" name="" id="" value="${userData.gender}" disabled></p>
        </div>
        <div>
            <p>Date of Birth: <input type="date" name="" id="" value="${formatedDOB}" disabled></p>
            <p>Age: <input type="number" name="" id="" value="${userData.age}" disabled></p>
        </div>
        <div>
            <p>State: <input type="text" name="" id="" value="${userData.state}" disabled></p>
            <p>LGA: <input type="text" name="" id="" value="${userData.lga}" disabled></p>
        </div>
        <div style="display: flex;">
            <p>Email: <input type="email" name="" id="" value="${userData.email}" disabled> 
            <span class="verified">${userData.isEmailVerified ? '&#10004' : '&#8987'}</span></p>
            <button class="${userData.isEmailVerified ? 'disable-verification-button' : 'mybutton'}" 
                id="verifyEmailButton" ${userData.isEmailVerified ? 'disabled' : ''}>
                ${userData.isEmailVerified ? 'Verified' : 'Verify Email'}
            </button>
        </div>
        <div style="display: flex;">
            <p>Phone: <input type="text" name="" id="" value="${userData.phonenumber}" disabled> 
            <span class="verified">${userData.isphonenumberVerified ? '&#10004' : '&#8987'}</span></p>
            <button class="${userData.isphonenumberVerified ? 'disable-verification-button' : 'mybutton'}" 
                onclick="verifyPhoneNumber()" ${userData.isphonenumberVerified && 'disabled'}>
                ${userData.isphonenumberVerified ? 'Verified' : 'Verify Phone No'}
            </button>
        </div>
    </div>
    <button class="mybutton" style="display: none" id="editProfile">Edit Profile</button>
    `;
    votingIdTable.innerHTML = `
    <tr>
        <th>Title</th>
        <th>Value</th>
        <th>Action</th>
    </tr>
    <tr>
        <td>VOTING ID</td>
        <td id="voting-id">${userData.votingID ? userData.votingID : '...'}</td>
        <td>
            <button id="copy-voting-id" onclick="clickToCopyVotingId('voting-id')"
            ${userData.votingID === '' ? 'disabled' : ''}>Copy Voting Id</button>
        </td>
    </tr>
    `;

    // Select verify email button to send otp to user email address
    const verifyEmailButton = document.getElementById('verifyEmailButton');
    verifyEmailButton.addEventListener('click', () => {
        verifyEmail(userData._id, userData.firstname, userData.lastname, userData.email);
    })
}

// Grab verify-email-content card and initiate api call to send OTP to user email
const verifyEmail = async (_id, firstname, lastname, email) => {
    const userData = {_id, firstname, lastname, email }
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'block';
    try {
        const response = await fetch('http://localhost:3000/emailOTP', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
            // credentials: 'include'
        });
        const data = await response.json();
        document.getElementById('verify-email-content-text').textContent = data.message;
    } catch (error) {
        console.error('Error sending verification code');
    }
}

// Function to notify user that email verification is successful or not
verifyEmailOTP.addEventListener('click', async () => {
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'none';
    const otp = document.getElementById('otp-code').value;
    const userData = {_id: globalUserData._id, email: globalUserData.email, otp }
    try {
        const response = await fetch('http://localhost:3000/verifyEmailOTP', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
            // credentials: 'include'
        });
        const data = await response.json();

        if (data.nextStep === 'correct' || data.nextStep === 'expired') {
            verifyEmailSuccess.style.display = 'block';
            getUserData(); // Call this function to populate userData
        } else {
            verifyEmailError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error sending verification code');
    }
})

// User Logout functionality to send request to server api
const logout = document.getElementById('logout');
logout.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/logout', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.redirected) {
                alert('Signing out...');
                window.location.href = response.url;
            } else {
                const data = await response.json();
                alert(data.message);
                window.location.href = "/user/user.html";
            }
    } catch (error) {
        console.error('Logout failed...' + error.message);
    }
})
