// Array dummy data to simulate fetched data from database
const votes = [
    { Surname: 'Smith', GivenNames: 'John Alex', Age: 35, VerificationProgress: '1/5', ProfileStatus: 'Rejected' },
    { Surname: 'Johnson', GivenNames: 'Lara Beth', Age: 42, VerificationProgress: '5/5', ProfileStatus: 'Approved' },
    { Surname: 'John', GivenNames: 'Doe', Age: 22, VerificationProgress: '4/5', ProfileStatus: 'Under Review' },
];

// All votes list
function openAllVotesTable() {
    const container = document.getElementsByClassName('votesTabContent')[0];
    let tableHTML = `<table id='votesTable'>
                        <thead>
                            <tr>
                                <th>Surname</th>
                                <th>Given Names</th>
                                <th>Age</th>
                                <th>Verification Progress</th>
                                <th>Profile Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>`;
    
    votes.forEach((vote, index) => {
        tableHTML += `<tr>
                        <td>${vote.Surname}</td>
                        <td>${vote.GivenNames}</td>
                        <td>${vote.Age}</td>
                        <td>${vote.VerificationProgress}</td>
                        <td>${vote.ProfileStatus}</td>
                        <td><button onclick="openModal(${index})">View</button></td>
                    </tr>`;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

// Approved Votes list
function openApprovedVotesTable() {
    const container = document.getElementsByClassName('votesTabContent')[1];
    let tableHTML = `<table id='votesTable'>
                        <thead>
                            <tr>
                                <th>Surname</th>
                                <th>Given Names</th>
                                <th>Age</th>
                                <th>Verification Progress</th>
                                <th>Profile Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>`;
    
    // Filter approvers votes list
    const approvedVotes = votes.filter(vote => vote.ProfileStatus === 'Approved');
    approvedVotes.forEach((vote, index) => {
        tableHTML += `<tr>
                        <td>${vote.Surname}</td>
                        <td>${vote.GivenNames}</td>
                        <td>${vote.Age}</td>
                        <td>${vote.VerificationProgress}</td>
                        <td>${vote.ProfileStatus}</td>
                        <td><button onclick="openModal(${index})">View</button></td>
                    </tr>`;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

// Under Review votes list
function openUnderReviewVotesTable() {
    const container = document.getElementsByClassName('votesTabContent')[2];
    let tableHTML = `<table id='votesTable'>
                        <thead>
                            <tr>
                                <th>Surname</th>
                                <th>Given Names</th>
                                <th>Age</th>
                                <th>Verification Progress</th>
                                <th>Profile Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>`;
    
    // Filter under review votes list
    const underReviewVotes = votes.filter(vote => vote.ProfileStatus === 'Under Review');
    underReviewVotes.forEach((vote, index) => {
        tableHTML += `<tr>
                        <td>${vote.Surname}</td>
                        <td>${vote.GivenNames}</td>
                        <td>${vote.Age}</td>
                        <td>${vote.VerificationProgress}</td>
                        <td>${vote.ProfileStatus}</td>
                        <td><button onclick="openModal(${index})">View</button></td>
                    </tr>`;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

// Rejected Votes list
function openRejectedVotesTable() {
    const container = document.getElementsByClassName('votesTabContent')[3];
    let tableHTML = `<table id='votesTable'>
                        <thead>
                            <tr>
                                <th>Surname</th>
                                <th>Given Names</th>
                                <th>Age</th>
                                <th>Verification Progress</th>
                                <th>Profile Status</th>
                            </tr>
                        </thead>
                        <tbody>`;
    
    // Filter under review votes list
    const rejectedVotes = votes.filter(vote => vote.ProfileStatus === 'Rejected');
    rejectedVotes.forEach((vote, index) => {
        tableHTML += `<tr>
                        <td>${vote.Surname}</td>
                        <td>${vote.GivenNames}</td>
                        <td>${vote.Age}</td>
                        <td>${vote.VerificationProgress}</td>
                        <td>${vote.ProfileStatus}</td>
                    </tr>`;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
};


// OPEN MODAL
function openModal(index) {
    console.log(index)
    // const vote = votes[index];
    // const modal = document.getElementById("modal");
    // const modalContent = document.getElementById("modalContent");

    // // Update the modal content with vote details
    // modalContent.innerHTML = `<strong>Surname:</strong> ${vote.Sname}<br>
    //                           <strong>Given Names:</strong> ${vote.Gnames}<br>
    //                           <strong>Age:</strong> ${vote.Age}<br>
    //                           <strong>Voting Progress:</strong> ${vote.VProgress}<br>
    //                           <strong>Participation Status:</strong> ${vote.PStatus}`;

    // modal.style.display = "block";
}




// VotesTab functionality
function openVotesTab(e, tabTitle) {
    var index, votesTabContent, votesTabLinks;

    votesTabContent = document.getElementsByClassName('votesTabContent');
    for (index = 0; index < votesTabContent.length; index++) {
        votesTabContent[index].style.display = 'none';
    }

    votesTabLinks = document.getElementsByClassName('votesTabLinks');
    for (index = 0; index < votesTabLinks.length; index++) {
        votesTabLinks[index].className = votesTabLinks[index].className.replace(" active", "");
    }

    document.getElementById(tabTitle).style.display = 'block';
    e.currentTarget.className += " active";

    if ( tabTitle == 'AllVotesTab') {
        openAllVotesTable();
    } else if (tabTitle == 'ApprovedVotes') {
        openApprovedVotesTable();
    } else if (tabTitle == 'UnderReviewVotes') {
        openUnderReviewVotesTable();
    } else {
        openRejectedVotesTable()
    }
}

document.getElementById('defaultVotesPage').click()