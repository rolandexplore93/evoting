// Tab functionality on admin page
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

document.getElementById('defaultPage').click();


// Authorize admin to their page and fetch admin data from the db
document.addEventListener('DOMContentLoaded', async () => {
    getUserData();
});

// Get user data from the database
const getUserData = async () => {
    // const userDashboard = document.getElementById('user-dashboard');
    try {

        const response = await fetch('http://localhost:3000/adminDashboard', {
            method: 'GET',
            credentials: 'include'
        });

        const data =  await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Authorization failed');
        }

        if (data.error === "No authorization token was found") {
            alert('Unauthorized! Please login to access this page')
            window.location.href = '/admin/admin.html';
            return
        }

        if (data.error === "jwt expired") {
            alert('Session expired! Please login again')
            window.location.href = '/admin/admin.html';
            return
        }

        const userData = data.userInfo;
        globalUserData = userData;
        // userDashboard.style.display = 'flex'
        populateUserData(userData)
    } catch (error) {
        console.error('Error:', error);
        alert('Not Authorized to access this page! Please login')
        window.location.href = '/admin/admin.html';
    }
}

function populateUserData(userData) {
    console.log(userData)
    const dashboardWelcome = document.getElementById('dashboard-welcome');
    dashboardWelcome.textContent = `Welcome ${userData.firstname} ${userData.lastname}`

}


// ADD PARTY LOGIC
// Display add party form
function showAddPartyForm() {
    document.getElementById('addPartyForm').style.display = 'block';
}

// Display party added successfully
function addParty() {
    document.getElementById('addPartyForm').style.display = 'none';
    document.getElementById('partyAddedSuccess').style.display = 'block';
    document.getElementById('addPartyButton').style.display = 'none';
}

// When 'Ok' is clicked on party added successful card, reset the form and go back to add party page
function goToAddParty() {
    document.getElementById('partyName').value = ''; // Reset partyName field
    document.getElementById('partyAcronym').value = ''; // Reset partyAcronym field
    document.getElementById('partyLogo').value = ''; // Reset logo  
    document.getElementById('addPartyButton').style.display = 'block';
    document.getElementById('addPartyForm').style.display = 'none';
    document.getElementById('partyAddedSuccess').style.display = 'none';
}

// CREATE ELECTION LOGIC
// Display create election form
function showCreateElectionForm() {
    document.getElementById('createElectionForm').style.display = 'block';
}

// Display creation election successful
function createElection() {
    document.getElementById('createElectionForm').style.display = 'none';
    document.getElementById('electionCreatedSuccess').style.display = 'block';
    document.getElementById('createElectionTag').style.display = 'none';
}

// When 'Ok' is clicked on party added successful card, reset the form and go back to add party page
function goToCreateElection() {
    document.getElementById('electionCategory').selectedIndex = 0;
    document.getElementById('electionType').selectedIndex = 0;
    document.getElementById('selectParty').selectedIndex = 0;
    document.getElementById('openDateTime').value = '';
    document.getElementById('closeDateTime').value = '';
    document.getElementById('createElectionForm').style.display = 'none';
    document.getElementById('electionCreatedSuccess').style.display = 'none';
    document.getElementById('createElectionTag').style.display = 'block';
}

// Create AddPartyToElectionForm logic
function ShowAddPartyToElectionForm() {
    document.getElementById('addPartyToElectionForm').style.display = 'block';
}

// Display party added to election
function addPartiesToElection() {
    document.getElementById('addPartyToElectionForm').style.display = 'none';
    document.getElementById('addPartyToElectionSuccess').style.display = 'block';
    document.getElementById('addPartyToElectionTag').style.display = 'none';
}

// When 'Ok' is clicked on party added successful card, reset the form and go back to add party page
function goToShowAddPartyToElectionForm() {
    document.getElementById('electionCategory').selectedIndex = 0;
    document.getElementById('electionType').selectedIndex = 0;
    document.getElementById('selectParties').selectedIndex = 0;
    document.getElementById('addPartyToElectionForm').style.display = 'none';
    document.getElementById('addPartyToElectionSuccess').style.display = 'none';
    document.getElementById('addPartyToElectionTag').style.display = 'block';
}


// ADD CANDIDATE LOGIC
// Dummy data representing election relationships
// const listOfParties = {
//     "1":""
// }

const electionData = {
    "GeneralElections": ["President", "Senate", "MHA"],
    "StatesElections": ["Governor", "HOR"],
    "LgaElections": ["Chairman", "Deputy"]
};

const partyData = {
    "President": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "Senate": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "MHA": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "Governor": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "HOR": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "Chairman": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "Deputy": ["ADC", "APC", "LP", "NNPP", "PDP"]
};

// Display add candidate page logic
function showAddCandidateForm() {
    document.getElementById('addCandidateForm').style.display = 'block';
}

function updateElectionTypes() {
    const category = document.getElementsByClassName('electionCategory')[2].value;
    const selectElectionType = document.getElementsByClassName('electionType')[1];
    selectElectionType.innerHTML = `<option value="">Select Election Type</option>`;
    console.log(category)
    console.log(selectElectionType)
    console.log(electionData[category])
    if (category && electionData[category]) {
        electionData[category].forEach(type => {
            const option = new Option(type, type);
            selectElectionType.add(option)
        });
    };

    updateParties();
}
function updateParties() {
    const selectElection = document.getElementsByClassName('electionType')[1].value;
    const selectParty = document.getElementsByClassName('selectParty')[0];
    selectParty.innerHTML = `<option value="">Select Party</option>`;

    console.log(selectElection)
    console.log(selectParty)
    console.log(partyData[selectElection])
    if (selectElection && partyData[selectElection]) {
        partyData[selectElection].forEach(party => {
            const option = new Option(party, party);
            selectParty.add(option)
        });
    };
}

function addCandidate() {
    document.getElementById('addCandidateForm').style.display = 'none';
    document.getElementById('candidateAddedSuccess').style.display = 'block';
}

function resetAddCandidate() {
    document.getElementsByClassName('electionCategory')[1].selectedIndex = 0;
    updateElectionTypes(); // Reset the parties
    document.getElementById('candidateName').value = '';
    document.getElementById('candidatePhoto').value = '';
    document.getElementById('candidateAddedSuccess').style.display = 'none';
};

