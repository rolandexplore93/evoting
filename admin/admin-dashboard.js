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

// Display party added successfully
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

// ADD CANDIDATE LOGIC
// Dummy data representing election relationships
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
    const category = document.getElementsByClassName('electionCategory')[1].value;
    const selectElectionType = document.getElementsByClassName('electionType')[1];
    selectElectionType.innerHTML = `<option value="">Select Election Type</option>`;

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
    const selectParty = document.getElementsByClassName('selectParty')[1];
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
}