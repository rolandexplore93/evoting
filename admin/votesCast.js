// VOTES TAB LOGIC
let votes; // Global variable to store votes cast retrieved from the database

// VotesTab functionality
function openVotesTab(e, tabTitle) {
    var index, votesTabContent, votesTabLinks;
    // Iterate over each tab content and set display to none
    votesTabContent = document.getElementsByClassName('votesTabContent');
    for (index = 0; index < votesTabContent.length; index++) {
        votesTabContent[index].style.display = 'none';
    }
    // Iterate over each tab link and remove 'active' class from it
    votesTabLinks = document.getElementsByClassName('votesTabLinks');
    for (index = 0; index < votesTabLinks.length; index++) {
        votesTabLinks[index].className = votesTabLinks[index].className.replace(" active", "");
    }
    // Display current tab, and add an "active" class style to it
    document.getElementById(tabTitle).style.display = 'block';
    e.currentTarget.className += " active";
    // Open the sub-tab page selected inside the voters tab page
    if (tabTitle == 'AllVotesTab') { openAllVotesTable(); } 
    else if (tabTitle == 'ApprovedVotes') { openApprovedVotesTable();} 
    else if (tabTitle == 'UnderReviewVotes') { openUnderReviewVotesTable();} 
    else { openRejectedVotesTable()}
}
document.getElementById('defaultVotesPage').click(); // Set AllVotesTab as default tab view

// Function to get the lists of all votes cast from the database
const decideVotesTabHeader = document.getElementById('decideVotesTabHeader');
decideVotesTabHeader.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/getAllVotes', {
            method: 'GET',
            credentials: 'include'
        });
        const data =  await response.json();
        if (!response.ok) throw new Error(data.error || 'Authorization failed');
        // Do not grant API access to unauthorized user 
        if (data.error === "No authorization token was found") {
            alert('Unauthorized! Please login to access this page')
            window.location.href = '/admin/admin.html';
            return
        }
        // Prompt user to login if session token has expired
        if (data.error === "jwt expired") {
            alert('Session expired! Please login again')
            window.location.href = '/admin/admin.html';
            return
        }
        const votesData = data.votes;
        votes = votesData; // Save all votes cast inside the global variable
        document.getElementById('AllVotesTab').click() //Open AllVotesTabTable
    } catch (error) {
        console.error('Error:', error);
        alert('Not Authorized to access this page! Please login')
        window.location.href = '/admin/admin.html';
    }
})

// Format ISO date format
function convertISOdateToHtmlFormat(isoDateString) {
    const date = new Date(isoDateString);
    const getDate = date.toISOString().split('T')[0];
    const getTime = date.toTimeString().split(' ')[0];
    return `${getDate} ${getTime}`
}

// Function to display All votes cast in the 'All' tab table
function openAllVotesTable() {
    const container = document.getElementsByClassName('votesTabContent')[0];
    // Sort votes list based on status priority
    const statusPriority = { 'Pending': 1, 'Approved': 2, 'Rejected': 3 };
    votes?.sort((a, b) => {
        return statusPriority[a.voteStatus] - statusPriority[b.voteStatus];
    });
    let tableHTML = `<table id='votesTable'>
                        <thead>
                            <tr>
                                <th>VoteId</th>
                                <th>Election</th>
                                <th>Name</th>
                                <th>Time Voted</th>
                                <th>Approval Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>`;
    votes?.forEach((vote, index) => {
        const dateVoted = vote.createdAt
        const formatDateVoted = convertISOdateToHtmlFormat(dateVoted)
        tableHTML += `<tr>
                <td>${vote.votingSerialId}</td>
                <td>${vote.RefElectionInfo.electionCategory} - ${vote.RefElectionInfo.electionName}</td>
                <td>${vote.userWhoVoted.firstname} ${vote.userWhoVoted.lastname}</td>
                <td>${formatDateVoted}</td>
                <td>${vote.voteStatus}</td>
                <td><button onclick="openModal(${index})">Preview</button></td>
            </tr>`;
    });
    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

//  Function to display All APPROVED votes in the 'APPROVED' tab table
function openApprovedVotesTable() {
    const container = document.getElementsByClassName('votesTabContent')[1];
    let tableHTML = `<table id='votesTable'>
                        <thead>
                            <tr>
                                <th>VoteId</th>
                                <th>Election</th>
                                <th>Initials</th>
                                <th>Time Voted</th>
                                <th>Approval Status</th>
                            </tr>
                        </thead>
                        <tbody>`;
    // Filter approvers votes list
    const approvedVotes = votes.filter(vote => vote.voteStatus === 'Approved');
    approvedVotes.forEach((vote, index) => {
        const dateVoted = vote.createdAt
        const formatDateVoted = convertISOdateToHtmlFormat(dateVoted)
        tableHTML += `<tr>
                <td>${vote.votingSerialId}</td>
                <td>${vote.RefElectionInfo.electionCategory} - ${vote.RefElectionInfo.electionName}</td>
                <td>${vote.userWhoVoted.firstname} ${vote.userWhoVoted.lastname}</td>
                <td>${formatDateVoted}</td>
                <td>${vote.voteStatus}</td>
            </tr>`;
    });
    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

//  Function to display All votes cast with UNDER REVIEW status in the 'UNDER REVIEW' tab table
function openUnderReviewVotesTable() {
    const container = document.getElementsByClassName('votesTabContent')[2];
    let tableHTML = `<table id='votesTable'>
                        <thead>
                            <tr>
                                <th>VoteId</th>
                                <th>Election</th>
                                <th>Initials</th>
                                <th>Time Voted</th>
                                <th>Approval Status</th>
                            </tr>
                        </thead>
                        <tbody>`;
    // Filter under review votes list
    const underReviewVotes = votes.filter(vote => vote.voteStatus === 'Pending');
    underReviewVotes.forEach((vote, index) => {
        const dateVoted = vote.createdAt
        const formatDateVoted = convertISOdateToHtmlFormat(dateVoted)
        tableHTML += `<tr>
                <td>${vote.votingSerialId}</td>
                <td>${vote.RefElectionInfo.electionCategory} - ${vote.RefElectionInfo.electionName}</td>
                <td>${vote.userWhoVoted.firstname} ${vote.userWhoVoted.lastname}</td>
                <td>${formatDateVoted}</td>
                <td>${vote.voteStatus}</td>
            </tr>`;
    });
    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
}

//  Function to display All REJECTED votes in the 'REJECTED' tab table
function openRejectedVotesTable() {
    const container = document.getElementsByClassName('votesTabContent')[3];
    let tableHTML = `<table id='votesTable'>
                        <thead>
                            <tr>
                                <th>VoteId</th>
                                <th>Election</th>
                                <th>Initials</th>
                                <th>Time Voted</th>
                                <th>Approval Status</th>
                            </tr>
                        </thead>
                        <tbody>`;
    // Filter under review votes list
    const rejectedVotes = votes.filter(vote => vote.voteStatus === 'Rejected');
    rejectedVotes.forEach((vote, index) => {
        const dateVoted = vote.createdAt
        const formatDateVoted = convertISOdateToHtmlFormat(dateVoted)
        tableHTML += `<tr>
                <td>${vote.votingSerialId}</td>
                <td>${vote.RefElectionInfo.electionCategory} - ${vote.RefElectionInfo.electionName}</td>
                <td>${vote.userWhoVoted.firstname} ${vote.userWhoVoted.lastname}</td>
                <td>${formatDateVoted}</td>
                <td>${vote.voteStatus}</td>
            </tr>`;
    });
    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
};

// Function to open a modal when each vote cast is previewed and populate the vote data in the modal content
function openModal(index) {
    const vote = votes[index];
    const modalContent = document.getElementById("modal-content");
    const dateVoted = vote.createdAt
    const formatDateVoted = convertISOdateToHtmlFormat(dateVoted)
    // Update the modal content with vote details
    modalContent.innerHTML = `<strong>VoteId:</strong> ${vote?.votingSerialId}<br>
        <strong>Election: </strong>${vote?.RefElectionInfo.electionCategory} - ${vote?.RefElectionInfo.electionName}<br>
        <strong>Initials: </strong>${vote?.userWhoVoted.firstname} ${vote?.userWhoVoted.lastname}<br>
        <strong>Time Voted:</strong> ${formatDateVoted}<br>
        <strong>Approval Status:</strong> ${vote?.voteStatus}
        <span class="close">&times;</span>
        <div class="modal-inner-content">
            <div id="voterTracking">
                <div id="userSelfie">
                    <h4>Profile Photo</h4>
                    <img src="http://localhost:3000/${vote?.userWhoVoted.uploadSelfie}" alt="selfie-image" 
                    width="200px%" height="150px">
                </div>
                <div id="userVotingScreenshots">
                    <h4>Voter's screenshots with timestamp during voting</h4>
                    <img src="/images/placeholder-image.jpeg" alt="" width="200px" height="150px">
                    <img src="/images/placeholder-image.jpeg" alt="" width="200px" height="150px">
                    <img src="/images/placeholder-image.jpeg" alt="" width="200px" height="150px">
                    <img src="http://localhost:3000/${vote?.userWhoVoted.uploadSelfie}" alt="selfie-image" 
                    width="200px%" height="150px">
                </div>
                <div id="userVotingVideo">
                    <h4>Voter's video recorded during voting</h4>
                    <video width="320" height="240" controls>
                        <source src="" type="video/mp4">
                    </video>
                </div>
            </div>
            <div id="voteActions">
                <select name="" id="voteDecider">
                    <option value="Approved">Approved</option>
                    <option value="Pending">Under Review</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <button id="updateVotesDeciderButton">Update</button>
            </div>
        </div>
    `;
    const modal = document.getElementsByClassName("modal")[1];                   
    modal.style.display = 'block';
    // Close votes modal
    document.getElementsByClassName("close")[0].onclick = function() {
        const modal = document.getElementsByClassName("modal")[1];                     
        modal.style.display = 'none';
    };
    // Grab the selectSelectecStatus button; disabled Under Review when clicked
    document.getElementById('voteDecider').addEventListener('change', function() {
        var updateVotesDeciderButton = document.getElementById('updateVotesDeciderButton');
        updateVotesDeciderButton.disabled = (this.value === 'Pending');
    });
    // handleDecideVoteSubmission
    const handleDecideVoteSubmissionButton = document.getElementById('updateVotesDeciderButton');
    handleDecideVoteSubmissionButton.addEventListener('click', () => {
        const selectedStatus = document.getElementById('voteDecider').value;
        const voteId = vote._id;
        const verifiedBy = globalUserData._id;
        handleDecideVoteSubmission(voteId, selectedStatus, verifiedBy)
    })
}

// Function for admin to decide whether a vote is accepted or rejected
const handleDecideVoteSubmission = async (voteId, selectedStatus, verifiedBy) => {
    try {
        const response = await fetch('http://localhost:3000/updateVoteStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ voteId, selectedStatus, verifiedBy }),
          credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
        alert(data.message); 
        location.reload(); // Reload page to fetch latest changes to the database
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

