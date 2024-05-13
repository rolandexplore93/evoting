let globalUserData; // uninitialized variable to hold admin data after login
// Tab functionality on admin page
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
    // Display current tab, and add an "active" class style to it
    document.getElementById(tabTitle).style.display = 'block';
    if (e != null) e.currentTarget.className += " active";
}
document.getElementById('defaultPage').click(); // Set Dashboard as default tab view

// When Admin is authorize to the portal, fetch admin data from the database
document.addEventListener('DOMContentLoaded', async () => {
    getUserData(); // See line 27
});

// Authorization to adminDashboard and retrieve admin data from the database
const getUserData = async () => {
    try {
        const response = await fetch('http://localhost:3000/adminDashboard', {
            method: 'GET',
            credentials: 'include'
        });
        const data =  await response.json();
        if (data.message === "Unauthorized Access!") {
            alert('Opps! You cannot access this page')
            window.location.href = '/user/user.html';
            return
        };
        if (data.error === "No authorization token was found") {
            alert('Token revoked! Please login to access this page')
            window.location.href = '/admin/admin.html';
            return
        };
        if (data.error === "jwt expired") {
            alert('Session expired! Please login again')
            window.location.href = '/admin/admin.html';
            return
        };
        document.getElementById('admin-dashboard-container').style.display = 'block'; 
        const userData = data.userInfo;
        globalUserData = userData; // Save admin data inside globalUserData variable
        populateUserData(userData) // See line 60
    } catch (error) {
        console.error('Error:', error);
        alert('Not Authorized to access this page! Please login')
        window.location.href = '/admin/admin.html';
    }
}

// Function to display admin names on the dashboard tab
function populateUserData(userData) {
    const dashboardWelcome = document.getElementById('dashboard-welcome');
    dashboardWelcome.textContent = `Welcome Admin, ${userData.firstname} ${userData.lastname}`
}


// ADD PARTY LOGIC: openAddPartyForm
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
    // Function to check if All Party form fields are filled
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

// FUNCTION to handle AddPartyForm submission call to the database
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
        location.reload();
        window.location.href = window.location.origin + window.location.pathname + '?tab=Add-Party';
        openTab(null, 'Add-Party');
    } catch (error) {
        alert('Error occured: ' + error.message);
    }
})

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
    // Attach event listener to handle changes when user selects an option
    updateCECategories.addEventListener('change', updateCategoryOptions); 
});

// CE - CreateElection: Function to update list of election type to match election category selected
function updateCategoryOptions() {
    const category = document.getElementsByClassName('electionCategory')[0].value;
    const selectElectionType = document.getElementsByClassName('electionType')[0];
    selectElectionType.innerHTML = `<option value="">Select Election Type</option>`;
    if (category && electionCategories[category]) {
        electionCategories[category].forEach(type => {
            const option = new Option(type, type);
            selectElectionType.add(option)
        });
    };
}

// CEPartyForm submission call to the database to save election
const createElectionForm = document.getElementById('createElectionForm');
createElectionForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('CreateElectionForm')
    const electionName = document.getElementById('electionTypeCE').value;
    const electionCategory = document.getElementById('electionCategoryCE').value;
    const openDate = document.getElementById('openDateTime').value;
    const closingDate = document.getElementById('closeDateTime').value;
    const createdByUserId = globalUserData._id;
    
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

// When the page loads, check for tab query parameter and open the tab
document.addEventListener('DOMContentLoaded', function(event) {
    var urlParams = new URLSearchParams(window.location.search);
    // console.log(urlParams)
    var tabToOpen = urlParams.get('tab');
    if (tabToOpen === 'Create-Election') {
        openTab(event, 'Create-Election'); // open Create-Election Tab
    } else if (tabToOpen === 'Add-Candidates') {
        openTab(event, 'Add-Candidates')
    } else if (tabToOpen === 'Add-Party') {
        openTab(event, 'Add-Party')
    } else if (tabToOpen === 'Voters') {
        openTab(event, 'Voters')
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

// Function to ShowAddPartyToElectionForm
async function ShowAddPartyToElectionForm() {
    const noElectionsMessage = document.getElementById('noElectionsMessage'); // Get noElectionsMessage html
    const addPartyToElectionForm = document.getElementById('addPartyToElectionForm'); // Get addPartyToElectionForm html
    const electionCategoryAP2E = document.getElementById('electionCategoryAP2E'); // Get electionCategoryAP2E dropdown html
    const selectParties = document.getElementById('selectParties'); // Get selectParties dropdown html
    const addPartiesToElectionButton = document.getElementById('addPartiesToElectionButton'); // addPartiesToElectionButton
    
    addPartyToElectionForm.style.display = 'block';
    const data = await getAllElectionsAndParties()
    allElectionsAndParties = data;
    if (data.elections?.length === 0) { // if no election, display no election available
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
        const selectedParties = Array.from(selectParties.selectedOptions).map(option => option.value);
        addPartiesToElectionButton.disabled = !(selectedElection && selectedParties.length > 0);
    }
}

// Function to Display party added to election
async function addPartiesToElection() {
    // Get the value (id) of electionCategoryAP2E dropdown html
    const electionId = document.getElementById('electionCategoryAP2E').value; 
    // Get the array list of each party selected from selectParties dropdown html
    const selectParties = Array.from(document.getElementById('selectParties').selectedOptions); 
    // Map over each selected parties array to get their value (id)
    const selectedPartiesIds = selectParties.map(party => party.value)
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
    // Reload and open Create Election tab
    window.location.href = window.location.origin + window.location.pathname + '?tab=Create-Election';
    openTab(null, 'Create-Election'); // Since no event is target, null is passed in as the first argument
}


// ADD CANDIDATE TO ELECTION AND PARTY LOGIC
// Hard coded data for election categories and type of election in each category
const electionCategories = {
    "General Elections 2024": ["President", "Senate", "MHA"],
    "States Elections 2024": ["Governor", "HOR"],
    "Lga Elections 2024": ["Chairman", "Deputy"]
};

// Retrieve created elections with participating parties from the database
const getElectionsAndParticipatingParties = async () => {
    try {
        const response = await fetch('http://localhost:3000/getElectionsAndParticipatingParties', {
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

// Display add candidate page logic
const showAddCandidateForm = async () => {
    const addCandidateFormTag = document.getElementById('addCandidateFormTag')
    const addCandidateFormTitle = document.getElementById('addCandidateFormTitle')
    const addCandidateForm = document.getElementById('addCandidateForm'); // Get addCandidateForm html
    const noElectionsInfoMessage = document.getElementById('noElectionsInfoMessage'); // Get noElectionsInfoMessage html
    const data = await getElectionsAndParticipatingParties(); // Retrieve created elections with participating parties
    if (data.electionInfo?.length === 0) { // if no election, display no election available
        noElectionsInfoMessage.style.display = 'block';
        addCandidateForm.style.display = 'none';
        addCandidateFormTag.style.display = 'none';
    } else {
        addCandidateFormTitle.style.display = 'block';
        addCandidateFormTag.style.display = 'none'; // disabled add candidate tag
        addCandidateForm.style.display = 'block';
        populateElectionCategories(data.electionInfo) // Refer to line 391
    }

    // Function to check if Add Candidate form fields are filled
    const addCandidateButton = document.getElementById('addCandidateButton');
    const toggleAddCandidateButtonState = () => {
        const inputs = document.querySelectorAll('.AC2EPInputField');
        // Check whether all form inputs have a value
        const allInputFilled = Array.from(inputs).every(input => input.value.trim() !== '');
        // Enable or disable the addCandidateButton based on the form fields being filled
        addCandidateButton.disabled = !allInputFilled;
    };
    // Add event listeners to each input field
    const addCandidateinputs = document.querySelectorAll('.AC2EPInputField');
    addCandidateinputs.forEach(input => {
        input.addEventListener('input', toggleAddCandidateButtonState);
    });
    // Initial check in case the form is pre-filled
    toggleAddCandidateButtonState();
}

// Function to populate election categories
function populateElectionCategories(electionInfo) {
    const electionCategorySelect = document.getElementById('electionCategoryAC2EP');
    // Populate election categories
    electionInfo.forEach(election => {
      const option = document.createElement('option');
      option.value = election._id;
      option.textContent = `${election.electionCategory} - ${election.electionName}`;
      electionCategorySelect.appendChild(option);
    });
  
    // Listen for changes to populate participating parties
    electionCategorySelect.addEventListener('change', (event) => {
      const selectedElection = electionInfo.find(election => election._id === event.target.value);
      // Call the Function to populate parties based on selected type
      populateParticipatingParties(selectedElection.participatingParties); 
    });
};

// Function to populate parties based on selected type
function populateParticipatingParties(parties) {
    const selectParty = document.getElementById('selectParty');
    selectParty.innerHTML = '<option value="">Select Party</option>'; // Clear current options in HTML
    if (parties.length === 0) {
      const noPartyOption = document.createElement('option');
      noPartyOption.textContent = 'No parties added yet, please add parties';
      selectParty.appendChild(noPartyOption);
    } else {
      parties.forEach(party => {
        const option = document.createElement('option');
        option.value = party._id;
        option.textContent = `${party.partyAcronym} - ${party.name}`;
        selectParty.appendChild(option);
      });
    }
}

// Function to process addCandidate form submission to API
async function addCandidate() {
    // HANDLE FORM DATA
    const electionInput = document.getElementById('electionCategoryAC2EP').value;
    const partyInput = document.getElementById('selectParty').value;
    const candidateName = document.getElementById('candidateName').value;
    const candidateImage = document.getElementById('candidateImage').files[0];

    const formData = new FormData();
    formData.append('electionId', electionInput);
    formData.append('partyId', partyInput);
    formData.append('candidateName', candidateName);
    formData.append('candidateImage', candidateImage);

    try {
        const response = await fetch('http://localhost:3000/addCandidateToElectionAndParty', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        const data = await response.json();
        console.log(response)
        console.log(data)
        if (!response.ok) throw new Error(`${data.message} statusCode: ${response.status}`);
        document.getElementById('addCandidateForm').style.display = 'none';
        document.getElementById('candidateAddedSuccess').style.display = 'block';
        document.getElementById('addCandidateFormTitle').style.display = 'none';
        document.getElementById('candidateAddedSuccessFeedback').textContent = data.message;
        alert(data.message)
    } catch (error) {
        // console.error('Error:', error);
        alert('Error occured: ' + error.message);
    }
}
// Function to Reset addCandidate form after submission and reload the tab
function resetAddCandidate() {
    document.getElementById('addCandidateForm').reset();
    window.location.href = window.location.origin + window.location.pathname + '?tab=Add-Candidates';
    openTab(null, 'Add-Candidates'); // Since no event is target, null is passed in as the first argument
};

// Admin Logout functionality
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
});