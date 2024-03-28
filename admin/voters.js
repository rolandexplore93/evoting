// Array dummy data to simulate fetched data from database
const voters = [
    { Surname: 'Smith', GivenNames: 'John Alex', Age: 35, VerificationProgress: '1/5', ProfileStatus: 'Rejected' },
    { Surname: 'Johnson', GivenNames: 'Lara Beth', Age: 42, VerificationProgress: '5/5', ProfileStatus: 'Approved' },
    { Surname: 'John', GivenNames: 'Doe', Age: 22, VerificationProgress: '4/5', ProfileStatus: 'Under Review' },
];

// All Voters list
function openAllVotersTable() {
    const container = document.getElementsByClassName('votersTabContent')[0];
    let tableHTML = `<table id='votersTable'>
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
    
    voters.forEach((voter, index) => {
        tableHTML += `<tr>
                        <td>${voter.Surname}</td>
                        <td>${voter.GivenNames}</td>
                        <td>${voter.Age}</td>
                        <td>${voter.VerificationProgress}</td>
                        <td>${voter.ProfileStatus}</td>
                        <td><button onclick="openModal(${index})">View</button></td>
                    </tr>`;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

// Approved Voters list
function openApprovedVotersTable() {
    const container = document.getElementsByClassName('votersTabContent')[1];
    let tableHTML = `<table id='votersTable'>
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
    
    // Filter approvers voters list
    const approvedVoters = voters.filter(voter => voter.ProfileStatus === 'Approved');
    approvedVoters.forEach((voter, index) => {
        tableHTML += `<tr>
                        <td>${voter.Surname}</td>
                        <td>${voter.GivenNames}</td>
                        <td>${voter.Age}</td>
                        <td>${voter.VerificationProgress}</td>
                        <td>${voter.ProfileStatus}</td>
                        <td><button onclick="openModal(${index})">View</button></td>
                    </tr>`;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

// Under Review Voters list
function openUnderReviewVotersTable() {
    const container = document.getElementsByClassName('votersTabContent')[2];
    let tableHTML = `<table id='votersTable'>
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
    
    // Filter under review voters list
    const underReviewVoters = voters.filter(voter => voter.ProfileStatus === 'Under Review');
    underReviewVoters.forEach((voter, index) => {
        tableHTML += `<tr>
                        <td>${voter.Surname}</td>
                        <td>${voter.GivenNames}</td>
                        <td>${voter.Age}</td>
                        <td>${voter.VerificationProgress}</td>
                        <td>${voter.ProfileStatus}</td>
                        <td><button onclick="openModal(${index})">View</button></td>
                    </tr>`;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

// Rejected Voters list
function openRejectedVotersTable() {
    const container = document.getElementsByClassName('votersTabContent')[3];
    let tableHTML = `<table id='votersTable'>
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
    
    // Filter under review voters list
    const rejectedVoters = voters.filter(voter => voter.ProfileStatus === 'Rejected');
    rejectedVoters.forEach((voter, index) => {
        tableHTML += `<tr>
                        <td>${voter.Surname}</td>
                        <td>${voter.GivenNames}</td>
                        <td>${voter.Age}</td>
                        <td>${voter.VerificationProgress}</td>
                        <td>${voter.ProfileStatus}</td>
                    </tr>`;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
};


// // OPEN MODAL
// function openModal(index) {
//     console.log(index)
//     // const voter = voters[index];
//     // const modal = document.getElementById("modal");
//     // const modalContent = document.getElementById("modalContent");

//     // // Update the modal content with voter details
//     // modalContent.innerHTML = `<strong>Surname:</strong> ${voter.Sname}<br>
//     //                           <strong>Given Names:</strong> ${voter.Gnames}<br>
//     //                           <strong>Age:</strong> ${voter.Age}<br>
//     //                           <strong>Voting Progress:</strong> ${voter.VProgress}<br>
//     //                           <strong>Participation Status:</strong> ${voter.PStatus}`;

//     // modal.style.display = "block";
// }


// OPEN MODAL
function openModal(index) {
    const voter = voters[index];
    const modalContent = document.getElementById("modal-content-voters");
    // Update the modal content with vote details
    modalContent.innerHTML = `<strong>VoteId:</strong> ${voter?.Age}<br>
                              <strong>Given Names:</strong> ${voter?.GivenNames}<br>
                              <strong>Age:</strong> ${voter?.Age}<br>
                              <strong>Voting Progress:</strong> ${voter?.VerificationProgress}<br>
                              <strong>Participation Status:</strong> ${voter?.ProfileStatus}
                              <span class="close">&times;</span>
                            `;
    const modal = document.getElementsByClassName("modal")[0];                     
    modal.style.display = 'block';

    // Close votes modal
    document.getElementsByClassName("close")[0].onclick = function() {
        const modal = document.getElementsByClassName("modal")[0];                     
        modal.style.display = 'none';
    };
}











// VotersTab functionality
function openVotersTab(e, tabTitle) {
    var index, votersTabContent, votersTabLinks;

    votersTabContent = document.getElementsByClassName('votersTabContent');
    for (index = 0; index < votersTabContent.length; index++) {
        votersTabContent[index].style.display = 'none';
    }

    votersTabLinks = document.getElementsByClassName('votersTabLinks');
    for (index = 0; index < votersTabLinks.length; index++) {
        votersTabLinks[index].className = votersTabLinks[index].className.replace(" active", "");
    }

    document.getElementById(tabTitle).style.display = 'block';
    e.currentTarget.className += " active";

    if ( tabTitle == 'AllVotersTab') {
        openAllVotersTable();
    } else if (tabTitle == 'ApprovedVoters') {
        openApprovedVotersTable();
    } else if (tabTitle == 'UnderReviewVoters') {
        openUnderReviewVotersTable();
    } else {
        openRejectedVotersTable()
    }
}

document.getElementById('defaultVotersPage').click()