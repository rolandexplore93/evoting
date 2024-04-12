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
    try {
        const response = await fetch('http://localhost:3000/adminDashboard', {
            method: 'GET',
            credentials: 'include'
        });

        const data =  await response.json();
        if (!response.ok)  throw new Error(data.error || 'Authorization failed');

        if (data.error === "No authorization token was found") {
            document.getElementById('admin-dashboard-container').style.display = 'none'; // Don't show page if user is not authorized
            alert('Unauthorized! Please login to access this page')
            window.location.href = '/admin/admin.html';
            return
        }

        if (data.error === "jwt expired") {
            document.getElementById('admin-dashboard-container').style.display = 'none'; // Don't show page if user session has expired
            alert('Session expired! Please login again')
            window.location.href = '/admin/admin.html';
            return
        }
        const userData = data.userInfo;
        globalUserData = userData;
        populateUserData(userData)
    } catch (error) {
        console.error('Error:', error);
        alert('Not Authorized to access this page! Please login')
        window.location.href = '/admin/admin.html';
    }
}

function populateUserData(userData) {
    const dashboardWelcome = document.getElementById('dashboard-welcome');
    dashboardWelcome.textContent = `Welcome ${userData.firstname} ${userData.lastname}`

}


// ADD PARTY LOGIC
const openAddPartyForm = document.getElementById('openAddPartyForm');
openAddPartyForm.addEventListener('click', () => {
    console.log('openAddPartyForm')
    document.getElementById('openAddPartyForm').style.display = 'none';
    document.getElementById('addPartyFormTitle').style.display = 'block';
    document.getElementById('addPartyForm').style.display = 'block';
})

// AddPartyForm: Display add party form and only enable add party button when all the form fields are filled 
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - openAddPartyForm')
    const addPartyButton = document.getElementById('addPartyButton');
    // Function to check if all fields are filled
    const toggleButtonState = () => {
        const inputs = document.querySelectorAll('.addPartyInputField');
        // Check whether all form inputs have a value
        const allInputFilled = Array.from(inputs).every(input => input.value.trim() !== '');
        // Enable or disable the addPartyButton based on the form fields being filled
        addPartyButton.disabled = !allInputFilled;
    };
    // Add event listeners to each input field
    const inputs = document.querySelectorAll('.addPartyInputField');
    inputs.forEach(input => {
        input.addEventListener('input', toggleButtonState);
    });
    // Initial check in case the form is pre-filled
    toggleButtonState();
});

const addPartyForm = document.getElementById('addPartyForm');
addPartyForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('partyName', document.getElementById('partyName').value);
        formData.append('partyAcronym', document.getElementById('partyAcronym').value);
        formData.append('partyLogo', document.getElementById('partyLogo').files[0]);
    
        try {
            const response = await fetch('http://localhost:3000/addParty', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })
            const data = await response.json();
            if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
            document.getElementById('partyAddedSuccess').style.display = 'block';
            document.getElementById('openAddPartyForm').style.display = 'none';
            document.getElementById('addPartyFormTitle').style.display = 'none';
            document.getElementById('addPartyForm').style.display = 'none';
            document.getElementById('addPartyButton').style.display = 'none';
            document.getElementById('partyAddedSuccessFeedback').textContent = data.message;
            alert(data.message)
        } catch (error) {
            // console.error('Error:', error);
            alert('Error occured adding Party!' + error.message);
        }
})

// Party added successful popup: When 'Ok' is clicked, reset the form and go back to add party page
const goToAddParty = document.getElementById('goToAddParty');
goToAddParty.addEventListener('click', () => {
    const handleAddPartyFormReset = document.getElementById('addPartyForm'); // Reset partyName, partyAcronym and logo fields
    handleAddPartyFormReset.reset(); 
    document.getElementById('openAddPartyForm').style.display = 'block';
    document.getElementById('addPartyFormTitle').style.display = 'none';
    document.getElementById('addPartyForm').style.display = 'none';
    document.getElementById('partyAddedSuccess').style.display = 'none';
    document.getElementById('addPartyButton').style.display = 'block';
})


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


// Admin Logout
const logout = document.getElementById('logout');
logout.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/logout', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.redirected) {
                alert('Signing out...');
                window.location.href = "/admin/admin.html";
            } else {
                const data = await response.json();
                alert(data.message);
                window.location.href = "/admin/admin.html";
            }
    } catch (error) {
        console.error('Logout failed...' + error.message);
    }
})
