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

// Dummy data voting simulation
const voter = {
    hasVotingId: true,
    votingId: '232123213',
    hasVoted: false,
    votedElections: {
        "GeneralElection": false,
        "StateElection": true,
        "LGAElection": false
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
document.getElementById('agreeConditions').addEventListener('change', function () {
    document.getElementById('startVoting').disabled = !this.checked;
});

// Select election activities
function startVoting() {
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
        if (electionSelected == 'GeneralElection') {
            showStep('nevs-PRESIDENT') // Open Presidential election
        }
    }
};

// Vote for President
function voteCandidate() {
    showStep('nevs-confirm-vote');
}

function changeVote() {
    showStep('nevs-PRESIDENT');
}

function goToNextElection() {
    showStep('nevs-SENATE');
}

// Vote of Senate
function voteCandidateSen() {
    showStep('nevs-confirm-vote-sen');
}

function changeVoteSen() {
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

// Authorize voters to their page
document.addEventListener('DOMContentLoaded', async () => {
    const userDashboard = document.getElementById('user-dashboard');
    try {

        const response = await fetch('http://localhost:3000/protected', {
            method: 'GET',
            credentials: 'include'
        });

        const data =  await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Authorization failed');
        }
        

        if (!data.success) {
            alert('Session has expired! Please login again')
            window.location.href = '/user/user.html';
            return
        }
        const userData = data.user;
        globalUserData = userData;
        userDashboard.style.display = 'flex'
        populateUserData(userData)
    } catch (error) {
        console.error('Error:', error);
        alert('Not Authorized to access this page! Please login')
        window.location.href = '/user/user.html';
    }
});

function populateUserData(userData) {
    console.log(userData)
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
        <img src="http://localhost:3000/${userData.uploadID}" alt="selfie-image" width="200px" height="200px">
    </div>
    <div>
        <p>ID CARD</p>
        <img src="http://localhost:3000/${userData.uploadSelfie}" alt="selfie-image" width="90%" height="150px">
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
    <button class="mybutton">Edit Profile</button>
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
        } else {
            verifyEmailError.style.display = 'block';
        }

    } catch (error) {
        console.error('Error sending verification code');
    }

})




// verified &#10004
// pending &#8987
// non-verified &#10008
// http://localhost:5500/user/user-dashboard.html
