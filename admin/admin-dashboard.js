let globalUserData; // uninitialized variable to hold admin data after login
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
    // Display current tab, and add an "active" class style to it
    document.getElementById(tabTitle).style.display = 'block';
    if (e != null) e.currentTarget.className += " active";
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
        globalUserData = userData; // Save admin data inside globalUserData
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
// openAddPartyForm
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
// AddPartyForm submission call to the database
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
        if (!response.ok) throw new Error(`${data.message} statusCode: ${response.status}`);
        document.getElementById('partyAddedSuccess').style.display = 'block';
        document.getElementById('openAddPartyForm').style.display = 'none';
        document.getElementById('addPartyFormTitle').style.display = 'none';
        document.getElementById('addPartyForm').style.display = 'none';
        document.getElementById('addPartyButton').style.display = 'none';
        document.getElementById('partyAddedSuccessFeedback').textContent = data.message;
        alert(data.message)
        // Reload and open Add-Party tab
        // window.location.href = window.location.origin + window.location.pathname + '?tab=Add-Party';
        // openTab(null, 'Add-Party'); // Since no event is target, null is passed in as the first argument
    } catch (error) {
        // console.error('Error:', error);
        alert('Error occured: ' + error.message);
    }
})

// // Party added successful popup: When 'Ok' is clicked, reset the form and go back to add party page
// const goToAddParty = document.getElementById('goToAddParty');
// goToAddParty.addEventListener('click', () => {
//     const handleAddPartyFormReset = document.getElementById('addPartyForm'); // Reset partyName, partyAcronym and logo fields
//     handleAddPartyFormReset.reset(); 
//     document.getElementById('openAddPartyForm').style.display = 'block';
//     document.getElementById('addPartyFormTitle').style.display = 'none';
//     document.getElementById('addPartyForm').style.display = 'none';
//     document.getElementById('partyAddedSuccess').style.display = 'none';
//     document.getElementById('addPartyButton').style.display = 'block';
// })


// CREATE ELECTION LOGIC
// Display create election form
const openCreateElectionForm = document.getElementById('createElectionTag');
openCreateElectionForm.addEventListener('click', () => {
    document.getElementById('createElectionForm').style.display = 'block';
});


// Create Election: Display create election form and only enable add election button when all the form fields are filled 
document.addEventListener('DOMContentLoaded', () => {
    // Configure election opening and closing date such that closing date cannot be before opening date
    const electionOpenDate = document.getElementById('openDateTime');
    const electionClosingDate = document.getElementById('closeDateTime');
    electionOpenDate.addEventListener('change', () => {
        electionClosingDate.min = electionOpenDate.value;
        electionClosingDate.disabled = false;
    })

    // Function to check if create election form fields are filled
    console.log('DOMContentLoaded - createElectionButton')
    const createElectionButton = document.getElementById('createElectionButton');
    const toggleButtonState = () => {
        const inputs = document.querySelectorAll('.CEInputField');
        // Check whether all form inputs have a value
        const allInputFilled = Array.from(inputs).every(input => input.value.trim() !== '');
        // Enable or disable the addPartyButton based on the form fields being filled
        createElectionButton.disabled = !allInputFilled;
    };
    // Add event listeners to each input field
    const inputs = document.querySelectorAll('.CEInputField');
    inputs.forEach(input => {
        input.addEventListener('input', toggleButtonState);
    });
    // Initial check in case the form is pre-filled
    toggleButtonState();

    updateCategoryOptions(); // Call updateCategoryOptions to first populate election categories and types
    const updateCECategories = document.getElementById('electionCategoryCE');
    updateCECategories.addEventListener('change', updateCategoryOptions); // Attach event listener to handle changes when user selects an option

    // getAllElectionsAndParties() //getAllElectionsAndParties
});

// CE - CreateElection
function updateCategoryOptions() {
    const category = document.getElementsByClassName('electionCategory')[0].value;
    const selectElectionType = document.getElementsByClassName('electionType')[0];
    selectElectionType.innerHTML = `<option value="">Select Election Type</option>`;
    // console.log(category)
    // console.log(selectElectionType)
    // console.log(electionCategories[category])
    if (category && electionCategories[category]) {
        electionCategories[category].forEach(type => {
            const option = new Option(type, type);
            selectElectionType.add(option)
        });
    };
}

// CEPartyForm submission call to the database
const createElectionForm = document.getElementById('createElectionForm');
createElectionForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('CreateElectionForm')
    const electionName = document.getElementById('electionTypeCE').value;
    const electionCategory = document.getElementById('electionCategoryCE').value;
    const openDate = document.getElementById('openDateTime').value;
    const closingDate = document.getElementById('closeDateTime').value;
    const createdByUserId = globalUserData._id;

    // console.log(electionName)
    // console.log(electionCategory)
    // console.log(openDate)
    // console.log(closingDate)
    // console.log(createdByUserId)
    
    try {
        const response = await fetch('http://localhost:3000/createElection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({electionName, electionCategory, openDate, closingDate, createdByUserId}),
            credentials: 'include'
        })
        console.log(response)
        const data = await response.json();
        if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
            // Display Election successful card
            console.log(data)
            console.log(data.message)
            document.getElementById('createElectionForm').style.display = 'none';
            document.getElementById('electionCreatedSuccess').style.display = 'block';
            document.getElementById('createElectionTag').style.display = 'none';
            // alert(data.message)
    } catch (error) {
        alert(error.message);
    }
})

// When 'Ok' is clicked on create election successful card, reset the form and go back to add party page
const goToCreateElection = document.getElementById('electionCreatedSuccessButton');
goToCreateElection.addEventListener('click', async () => {
    window.location.href = window.location.origin + window.location.pathname + '?tab=Create-Election';
    openTab(null, 'Create-Election'); // Since no event is target, null is passed in as the first argument
})

// When the page loads, check for the query parameter and open the "Create-Election" tab
document.addEventListener('DOMContentLoaded', function(event) {
    var urlParams = new URLSearchParams(window.location.search);
    // console.log(urlParams)
    var tabToOpen = urlParams.get('tab');
    if (tabToOpen === 'Create-Election') {
        openTab(event, 'Create-Election'); // You will need to pass the appropriate event or element here
    }
});

// ADD PARTIES TO ELECTION
// Create AddPartyToElectionForm logic
const getAllElectionsAndParties = async () => {
    console.log('getAllElectionsAndParties')
    try {
        const response = await fetch('http://localhost:3000/getAllElectionsAndParties', {
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
// Show ShowAddPartyToElectionForm
async function ShowAddPartyToElectionForm() {
    const noElectionsMessage = document.getElementById('noElectionsMessage'); // Get noElectionsMessage html
    const addPartyToElectionForm = document.getElementById('addPartyToElectionForm'); // Get addPartyToElectionForm html
    const electionCategoryAP2E = document.getElementById('electionCategoryAP2E'); // Get electionCategoryAP2E dropdown html
    const selectParties = document.getElementById('selectParties'); // Get selectParties dropdown html
    const addPartiesToElectionButton = document.getElementById('addPartiesToElectionButton'); // addPartiesToElectionButton
    
    addPartyToElectionForm.style.display = 'block';
    const data = await getAllElectionsAndParties()
    if (data.elections.length === 0) { // if no election, display no election available
        noElectionsMessage.style.display = 'block';
        addPartyToElectionForm.style.display = 'none';
    } else {
        document.getElementById('addPartyToElectionTag').style.display = 'none'; // disabled add election tag
        // Populate elections dropdown
        data.elections.forEach(election => {
        const option = new Option(`${election.electionCategory} - ${election.electionName}`, election._id);
        electionCategoryAP2E.add(option);
        });
        // Populate parties dropdown
        data.parties.forEach(party => {
        const option = new Option(`${party.partyAcronym} - ${party.name}`, party._id);
        selectParties.add(option);
        });
    }


    // Listener for selections
    electionCategoryAP2E.addEventListener('change', toggleCreateButton);
    selectParties.addEventListener('change', toggleCreateButton);

    // Function to enable or disable the create button
    function toggleCreateButton() {
        const selectedElection = electionCategoryAP2E.value;
        // console.log(selectedElection)
        const selectedParties = Array.from(selectParties.selectedOptions).map(option => option.value);
        // console.log(selectedParties)
        addPartiesToElectionButton.disabled = !(selectedElection && selectedParties.length > 0);
    }
}

// Display party added to election
async function addPartiesToElection() {

    const electionId = document.getElementById('electionCategoryAP2E').value; // Get the value (id) of electionCategoryAP2E dropdown html
    const selectParties = Array.from(document.getElementById('selectParties').selectedOptions); // Get the array list of each party selected from selectParties dropdown html
    const selectedPartiesIds = selectParties.map(party => party.value) // Map over each selected parties array to get their value (id)

    try {
        const response = await fetch('http://localhost:3000/addPartiesToElection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({electionId, selectedPartiesIds}),
            credentials: 'include'
        })
        console.log(response)
        const data = await response.json();
        console.log(data)
        if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
        // Display addPartyToElectionSuccess card
        document.getElementById('addPartyToElectionForm').style.display = 'none';
        document.getElementById('addPartyToElectionTag').style.display = 'none';
        document.getElementById('addPartyToElectionSuccess').style.display = 'block';
        document.getElementById('addPartyToElectionSuccessText').textContent = data.message;
    } catch (error) {
        alert(error.message);
    }
}

// When 'Ok' is clicked on party added successful card, reset the form and go back to add party page
function goToShowAddPartyToElectionForm() {
    // document.getElementById('electionCategoryAP2E').selectedIndex = 0;
    // document.getElementById('electionType').selectedIndex = 0;
    // document.getElementById('selectParties').selectedIndex = 0;
    // document.getElementById('addPartyToElectionForm').style.display = 'none';
    // document.getElementById('addPartyToElectionSuccess').style.display = 'none';
    // document.getElementById('addPartyToElectionTag').style.display = 'block';

    // Reload and open Create Election tab
    window.location.href = window.location.origin + window.location.pathname + '?tab=Create-Election';
    openTab(null, 'Create-Election'); // Since no event is target, null is passed in as the first argument
}


// ADD CANDIDATE TO ELECTION AND PARTY LOGIC
// Hard coded data form elections and parties

const electionData = {
    "GeneralElections": ["President", "Senate", "MHA"],
    "StatesElections": ["Governor", "HOR"],
    "LgaElections": ["Chairman", "Deputy"]
};

const electionCategories = {
    "General Elections 2024": ["President", "Senate", "MHA"],
    "States Elections 2024": ["Governor", "HOR"],
    "Lga Elections 2024": ["Chairman", "Deputy"]
};

const electionTypeAndParties =  {
    "President": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "Senate": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "MHA": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "Governor": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "HOR": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "Chairman": ["ADC", "APC", "LP", "NNPP", "PDP"],
    "Deputy": ["ADC", "APC", "LP", "NNPP", "PDP"]
}

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

// Retrieve created elections with participating parties
const getElectionsAndParticipatingParties = async () => {
    console.log('getElectionsAndParticipatingParties')
    try {
        const response = await fetch('http://localhost:3000/getElectionsAndParticipatingParties', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
        console.log(data.electionInfo)
        return data
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message)
    }
}
// getElectionsAndParticipatingParties()

function updateElectionTypes() {
    const category = document.getElementsByClassName('electionCategory')[2].value;
    const selectElectionType = document.getElementsByClassName('electionType')[1];
    selectElectionType.innerHTML = `<option value="">Select Election Type</option>`;
    // console.log(category)
    // console.log(selectElectionType)
    // console.log(electionData[category])
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
