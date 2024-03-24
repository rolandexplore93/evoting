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

// When 'Ok' is clicked on party added successful card, go back to add party page
function goToAddParty() {
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

// When 'Ok' is clicked on party added successful card, go back to add party page
function goToCreateElection() {
    document.getElementById('createElectionForm').style.display = 'none';
    document.getElementById('electionCreatedSuccess').style.display = 'none';
    document.getElementById('createElectionTag').style.display = 'block';
}