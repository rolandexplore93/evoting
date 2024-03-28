// Array dummy data to simulate fetched data from database
const votes = [
    { VoteId: 1, NamesInitials: 'S. J. A', Age: 35, TimeVoted: '2023-05-12', Status: 'Rejected' },
    { VoteId: 2, NamesInitials: 'J. L. B', Age: 42, TimeVoted: '2023-05-12', Status: 'Approved' },
    { VoteId: 3, NamesInitials: 'J. D', Age: 22, TimeVoted: '2023-05-12', Status: 'Under Review' },
];

// All votes list
function openAllVotesTable() {
    const container = document.getElementsByClassName('votesTabContent')[0];
    let tableHTML = `<table id='votesTable'>
                        <thead>
                            <tr>
                                <th>VoteId</th>
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
                        <td>${vote.VoteId}</td>
                        <td>${vote.NamesInitials}</td>
                        <td>${vote.Age}</td>
                        <td>${vote.TimeVoted}</td>
                        <td>${vote.Status}</td>
                        <td><button onclick="openModal(${index})">Preview</button></td>
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
                                <th>VoteId</th>
                                <th>Given Names</th>
                                <th>Age</th>
                                <th>Verification Progress</th>
                                <th>Profile Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>`;

    // Filter approvers votes list
    const approvedVotes = votes.filter(vote => vote.Status === 'Approved');
    approvedVotes.forEach((vote, index) => {
        tableHTML += `<tr>
                        <td>${vote.VoteId}</td>
                        <td>${vote.NamesInitials}</td>
                        <td>${vote.Age}</td>
                        <td>${vote.TimeVoted}</td>
                        <td>${vote.Status}</td>
                        <td><button onclick="openModal(${index})">Preview</button></td>
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
                                <th>VoteId</th>
                                <th>Given Names</th>
                                <th>Age</th>
                                <th>Verification Progress</th>
                                <th>Profile Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>`;

    // Filter under review votes list
    const underReviewVotes = votes.filter(vote => vote.Status === 'Under Review');
    underReviewVotes.forEach((vote, index) => {
        tableHTML += `<tr>
                        <td>${vote.VoteId}</td>
                        <td>${vote.NamesInitials}</td>
                        <td>${vote.Age}</td>
                        <td>${vote.TimeVoted}</td>
                        <td>${vote.Status}</td>
                        <td><button onclick="openModal(${index})">Preview</button></td>
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
                                <th>VoteId</th>
                                <th>Given Names</th>
                                <th>Age</th>
                                <th>Verification Progress</th>
                                <th>Profile Status</th>
                            </tr>
                        </thead>
                        <tbody>`;

    // Filter under review votes list
    const rejectedVotes = votes.filter(vote => vote.Status === 'Rejected');
    rejectedVotes.forEach((vote, index) => {
        tableHTML += `<tr>
                        <td>${vote.VoteId}</td>
                        <td>${vote.NamesInitials}</td>
                        <td>${vote.Age}</td>
                        <td>${vote.TimeVoted}</td>
                        <td>${vote.Status}</td>
                    </tr>`;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
};


// OPEN MODAL
function openModal(index) {
    const vote = votes[index];
    const modalContent = document.getElementById("modal-content");
    // Update the modal content with vote details
    modalContent.innerHTML = `<strong>VoteId:</strong> ${vote?.VoteId}<br>
                              <strong>Given Names:</strong> ${vote?.NamesInitials}<br>
                              <strong>Age:</strong> ${vote?.Age}<br>
                              <strong>Voting Progress:</strong> ${vote?.TimeVoted}<br>
                              <strong>Participation Status:</strong> ${vote?.Status}
                              <span class="close">&times;</span>
                                <div class="modal-inner-content">
                                    <div id="voterTracking">
                                        <div id="userSelfie">
                                            <h4>Profile Image</h4>
                                            <img src="/images/placeholder-image.jpeg" alt="" width="200px" height="150px">
                                        </div>
                                        <div id="userVotingScreenshots">
                                            <h4>Voter's screenshots with timestamp during voting</h4>
                                            <img src="/images/placeholder-image.jpeg" alt="" width="200px" height="150px">
                                            <img src="/images/placeholder-image.jpeg" alt="" width="200px" height="150px">
                                            <img src="/images/placeholder-image.jpeg" alt="" width="200px" height="150px">
                                            <img src="/images/placeholder-image.jpeg" alt="" width="200px" height="150px">
                                        </div>
                                        <div id="userVotingVideo">
                                            <h4>Voter's video recorded during voting</h4>
                                            <video width="320" height="240" controls>
                                                <source src="movie.mp4" type="video/mp4">
                                            </video>
                                        </div>
                                    </div>
                                    <div id="voteActions">
                                        <select name="" id="">
                                            <option value="approved">Approved</option>
                                            <option value="underReview">Under Review</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <button>Update</button>
                                    </div>
                                </div>
                            `;
    const modal = document.getElementsByClassName("modal")[0];                     
    modal.style.display = 'block';

    // Close votes modal
    document.getElementsByClassName("close")[0].onclick = function() {
        const modal = document.getElementsByClassName("modal")[0];                     
        modal.style.display = 'none';
    };
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

    if (tabTitle == 'AllVotesTab') {
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