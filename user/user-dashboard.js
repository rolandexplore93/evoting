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

let globalUserData;
let allElectionsWithPartiesAndCandidates; // uninitialized variable to hold election information

document.addEventListener('DOMContentLoaded', async () => {
    allElectionsWithPartiesAndCandidates = await getElectionsWithPartiesAndCandidates();
    // console.log(allElectionsWithPartiesAndCandidates)
});

// Get all elections
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

// verifying emailotp success done
document.getElementById('otp-email-success').onclick = function () {
    modal.style.display = 'none';
    verifyEmailContent.style.display = 'none';
    verifyEmailSuccess.style.display = 'none';
}

//emailotp error try again
document.getElementById('otp-email-error').onclick = function () {
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'block';
    verifyEmailError.style.display = 'none';
}

//emailotp error cancel page
document.getElementById('go-to-dashboard').onclick = function () {
    modal.style.display = 'none';
    verifyEmailContent.style.display = 'none';
    verifyEmailError.style.display = 'none';
}

function verifyPhoneNumber() {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'block';
}

// phoneno enter code
verifyPhoneOTP.onclick = function () {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoSuccess.style.display = 'block';
}

//phoneno otp error
verifyPhoneOTP.onclick = function () {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoError.style.display = 'block';
}

// phoneno success done
document.getElementById('otp-phone-success').onclick = function () {
    modal.style.display = 'none';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoSuccess.style.display = 'none';
}

//phoneno otp error try again
document.getElementById('otp-phone-error').onclick = function () {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'block';
    verifyPhonenoError.style.display = 'none';
}

//phoneno otp error cancel page
document.getElementById('go-to-dashboard-now').onclick = function () {
    modal.style.display = 'none';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoError.style.display = 'none';
}

// Tab functionality
function openTab(e, tabTitle) {
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

    document.getElementById('copy-voting-id').textContent = 'Voting ID Copied';
    document.getElementById('copy-voting-id').classList.add('copy-clipboard');

    setTimeout(() => {
        document.getElementById('copy-voting-id').classList.remove('copy-clipboard');
        document.getElementById('copy-voting-id').textContent = 'Copy Voting Id';
    }, 600)
}

// Click Elections
function goToElections() {
    if (globalUserData.votingID != '') { // If user has a votingId generated, go to choose language
        showStep('nevs-choose-language')
    } else {
        showStep('nevs-profile-not-verified') // No votingId? call goToElectionPage()
    }
}

// Profile is not verified, voting id is not correct or user already voted go back to election page
function goToElectionPage() {
    showStep('nevs-start-election-page')
    location.reload()
}

//After choosing a language, next is to enter Voting ID page
function enterVotingId() {
    showStep('nevs-enter-voting-id')
}

// Validate Voting ID
function validateVotingId() {
    var enteredVotingId = document.getElementById('votingID').value;
    console.log(enteredVotingId)

    if (enteredVotingId == globalUserData.votingID) {
        showStep('nevs-election-conditions') // go to terms and conditions page
    } else {
        showStep('nevs-voting-id-not-valid') // alert user that voting id is not correct
    }
}

// Voting ID is not correct, enter voting ID again
function ReEnterVotingId() {
    showStep('nevs-enter-voting-id')
}

// Checkbox confirmation: Agree to conditions and start voting
document.getElementById('agreeConditions').addEventListener('change', function () {
    document.getElementById('startVoting').disabled = !this.checked;
});

// Select election activities
function startVoting() {
    showStep('nevs-select-election');
    console.log()

    const electionInfo = allElectionsWithPartiesAndCandidates.electionInfo
    const electionCategorySelect = document.getElementById('electionSelection');
    // Populate election categories
    electionInfo?.forEach(election => {
      const option = document.createElement('option');
      option.value = election._id;
      option.textContent = `${election.electionCategory} - ${election.electionName}`;
      electionCategorySelect.appendChild(option);
    });

    // document.getElementById('confirmElection').disabled = !this.checked;
  
    // Listen for changes to populate participating parties
    electionCategorySelect.addEventListener('change', (event) => {
        // const selectedElection = electionInfo.find(election => election._id === event.target.value);
        // console.log(selectedElection)
        toggleCreateButton();
    });

    // Function to enable or disable the confirm election button
    function toggleCreateButton() {
        const selectedElection = electionCategorySelect.value;
        document.getElementById('confirmElection').disabled = !selectedElection;
    }
};

// Select election to participate in
function confirmElection() {
    var electionSelectedId = document.getElementById('electionSelection').value;
    var electionSelected = allElectionsWithPartiesAndCandidates.electionInfo?.find(election => election._id === electionSelectedId);
    console.log(electionSelectedId)
    console.log(electionSelected)
    // handleElectionSelection(electionSelected);
    if (globalUserData.votedInElection.includes(electionSelected._id)) {
        showStep('nevs-voter-already-voted')
    } else {
        showElectionForm(electionSelected)
    }
}

const showElectionForm = (electionSelected) => {
    const participatingParties = electionSelected.participatingParties;
    const participatingCandidates = electionSelected.participatingCandidates;

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
                        const candidateImage = candidate ? `<img src="http://localhost:3000/${candidate.candidateImage}" alt="${candidateName}" width="30px" height="30px">` : '<img src="/images/placeholder-image.jpeg" alt="${candidateName}" width="30px" height="30px">';

                        return `
                            <tr>
                                <td>${party.partyAcronym} - ${party.name}</td>
                                <td><img src="http://localhost:3000/${party.partyLogo}" alt="${party.name}" width="30px" height="30px"></td>
                                <td>${candidateName}</td>
                                <td>${candidateImage}</td>
                                <td><input type="radio" name="voteOption" value="${electionSelected._id}-${party._id}-${party.partyAcronym}-${candidate ? candidate._id : 'NoID'}-${candidateName}"></td>
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
    displayElection.innerHTML = ballotHTML;

    // Call showStep() to display this form after the html has rendered
    showStep(`nevs-${electionSelected._id}`);

    // Enable the voteButton when a user select at least one vote
    document.querySelectorAll(`[name="voteOption"]`).forEach(radio => {
        radio.addEventListener('change', (e) => {
            console.log(e.target.value)
          document.getElementById("voteButton").disabled = false;
        });
    });

    const voteCandidateButton = document.getElementById('voteButton');
    voteCandidateButton.addEventListener('click', voteCandidate);

    const votingCompletedButton = document.getElementById('confirmVote');
    votingCompletedButton.addEventListener('click', () => {
        const voteData = document.querySelector(`[name="voteOption"]:checked`).value;
        votingCompleted(voteData)
    });
}

// Vote for President

function voteCandidate() {
    showStep('nevs-confirm-vote');
}

function changeVote(stepTag) {
    showStep(stepTag);
    // showStep('nevs-PRESIDENT');
}

async function votingCompleted(voteData) {
    const userVote = voteData.split('-');
    const electionId = userVote[0];
    const partyId = userVote[1];
    const partyVotedFor = userVote[2];
    const candidateId = userVote[3];
    const candidateVotedFor = userVote[4];
    const userId = globalUserData._id;

    console.log(electionId)
    console.log(partyId)
    console.log(partyVotedFor)
    console.log(candidateId)
    console.log(candidateVotedFor)
    console.log(userId)

    try {
        const response = await fetch('http://localhost:3000/voteSubmission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ electionId, partyId, partyVotedFor, candidateId, candidateVotedFor, userId}),
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
        const data = await response.json();
        console.log(data)
        showStep('nevs-voting-successful')
    } catch (error) {
        console.error('Error saving user vote');
        alert('Error saving user vote');
    }
    
}

function goToDashboard() {
    window.location = '/user/user-dashboard.html';
}

function goToResults() {
    window.location = '/election-results/electionresults.html';
}

// Election voting process using 
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

        if (data.error === "No authorization token was found") {
            alert('Unauthorized! Please login to access this page')
            window.location.href = '/user/user.html';
            return
        }

        if (data.error === "jwt expired") {
            alert('Session expired! Please login again')
            window.location.href = '/user/user.html';
            return
        }

        const userData = data.userInfo;
        globalUserData = userData;
        userDashboard.style.display = 'flex'
        populateUserData(userData)
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
            <button class="${userData.isEmailVerified ? 'disable-verification-button' : 'mybutton'}" id="verifyEmailButton" ${userData.isEmailVerified ? 'disabled' : ''}>${userData.isEmailVerified ? 'Verified' : 'Verify Email'}</button>
        </div>
        <div style="display: flex;">
            <p>Phone: <input type="text" name="" id="" value="${userData.phonenumber}" disabled> 
            <span class="verified">${userData.isphonenumberVerified ? '&#10004' : '&#8987'}</span></p>
            <button class="${userData.isphonenumberVerified ? 'disable-verification-button' : 'mybutton'}" onclick="verifyPhoneNumber()" ${userData.isphonenumberVerified && 'disabled'}>${userData.isphonenumberVerified ? 'Verified' : 'Verify Phone No'}</button>
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
            <button id="copy-voting-id" onclick="clickToCopyVotingId('voting-id')" ${userData.votingID === '' ? 'disabled' : ''}>Copy Voting Id</button>
        </td>
    </tr>
    `;

    // Select verify email button to send otp to user email address
    const verifyEmailButton = document.getElementById('verifyEmailButton');
    verifyEmailButton.addEventListener('click', () => {
        verifyEmail(userData._id, userData.firstname, userData.lastname, userData.email);
    })

    // const editProfileButton = document.getElementById('editProfile');
    // editProfileButton.addEventListener('click', () => {
    //     editProfile()
    // })
}

// Grab verify-email-content card
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

verifyEmailOTP.addEventListener('click', async () => {
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'none';
    const otp = document.getElementById('otp-code').value;
    console.log(globalUserData)
    const userData = {_id: globalUserData._id, email: globalUserData.email, otp }
    try {
        const response = await fetch('http://localhost:3000/verifyEmailOTP', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
            // credentials: 'include'
        });
        const data = await response.json();
        console.log(data);

        if (data.nextStep === 'correct' || data.nextStep === 'expired') {
            verifyEmailSuccess.style.display = 'block';
            getUserData();
        } else {
            verifyEmailError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error sending verification code');
    }

})


// Logout
const logout = document.getElementById('logout');
logout.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/logout', {
                method: 'GET',
                credentials: 'include'
            });
            
            console.log(response.redirected)
            console.log(response.url)
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

// const editProfile = () => {
    
// }





// verified &#10004
// pending &#8987
// non-verified &#10008
// http://localhost:5500/user/user-dashboard.html
