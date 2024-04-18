// VOTERS TAB LOGIC
let voters; // Variable to store voters information from the database

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

// document.addEventListener('DOMContentLoaded', async () => {
    
// })
const votersTabHeader = document.getElementById('votersTabHeader');
votersTabHeader.addEventListener('click', async () => {
    console.log('votersTabHeader')
    
    try {
        const response = await fetch('http://localhost:3000/allVoterUsersWithRole5', {
            method: 'GET',
            credentials: 'include'
        });

        const data =  await response.json();
        if (!response.ok) throw new Error(data.error || 'Authorization failed');

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

        const userData = data.usersInfo;
        voters = userData;
        document.getElementById('AllVotersTab').click() //Open AllVotersTabTable
    } catch (error) {
        console.error('Error:', error);
        alert('Not Authorized to access this page! Please login')
        window.location.href = '/admin/admin.html';
    }
})


// All Voters list
function openAllVotersTable() {
    const container = document.getElementsByClassName('votersTabContent')[0];
    // Sort voters list based on status priority
    const statusPriority = { 'Under Review': 1, 'Approved': 2, 'Rejected': 3 };
    voters?.sort((a, b) => {
        return statusPriority[a.profileStatus] - statusPriority[b.profileStatus];
    });

    let tableHTML = `<table id='votersTable'>
                        <thead>
                            <tr>
                                <th>Surname</th>
                                <th>Firstname</th>
                                <th>Age</th>
                                <th>Email</th>
                                <th>Profile Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>`;
    
    voters?.forEach((voter, index) => {
        tableHTML += `<tr>
                        <td>${voter.lastname}</td>
                        <td>${voter.firstname}</td>
                        <td>${voter.age}</td>
                        <td>${voter.email}</td>
                        <td>${voter.profileStatus}</td>
                        <td><button onclick="openVotersModal(${index})">View</button></td>
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
                            <th>Firstname</th>
                            <th>Age</th>
                            <th>Email</th>
                            <th>Profile Status</th>
                        </tr>
                        </thead>
                        <tbody>`;
    
    // Filter approved voters list
    const approvedVoters = voters?.filter(voter => voter.profileStatus === "Approved");
    approvedVoters.forEach((voter, index) => {
        tableHTML += `<tr>
                        <td>${voter.lastname}</td>
                        <td>${voter.firstname}</td>
                        <td>${voter.age}</td>
                        <td>${voter.email}</td>
                        <td>${voter.profileStatus}</td>
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
                                <th>Firstname</th>
                                <th>Age</th>
                                <th>Email</th>
                                <th>Profile Status</th>
                            </tr>
                        </thead>
                        <tbody>`;
    
    // Filter under review voters list
    const underReviewVoters = voters?.filter(voter => voter.profileStatus === "Under Review");
    underReviewVoters.forEach((voter, index) => {
        tableHTML += `<tr>
                        <td>${voter.lastname}</td>
                        <td>${voter.firstname}</td>
                        <td>${voter.age}</td>
                        <td>${voter.email}</td>
                        <td>${voter.profileStatus}</td>
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
                                <th>Email</th>
                                <th>Profile Status</th>
                            </tr>
                        </thead>
                        <tbody>`;
    
    // Filter under review voters list
    const rejectedVoters = voters?.filter(voter => voter.profileStatus === "Rejected");
    rejectedVoters.forEach((voter, index) => {
        tableHTML += `<tr>
                        <td>${voter.lastname}</td>
                        <td>${voter.firstname}</td>
                        <td>${voter.age}</td>
                        <td>${voter.email}</td>
                        <td>${voter.profileStatus}</td>
                    </tr>`;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;
};

// OPEN MODAL
function openVotersModal(index) {
    const voter = voters[index];
    const modalContent = document.getElementById("modal-content-voters");
    // Format ISO date format
    function convertISOdateToHtmlFormat(isoDateString) {
        const date = new Date(isoDateString);
        return date.toISOString().split('T')[0];
    }
    const dob = voter.dateOfBirth 
    const formatedDOB = convertISOdateToHtmlFormat(dob)
    // Update the modal content with voter details
    modalContent.innerHTML = `
    <span class="close">&times;</span>
    <div class="topSection">
        <div class="topSectionSelfie"><h4>Photo</h4><img src="http://localhost:3000/${voter.uploadSelfie}" alt="selfie-image" width="50%" height="250px"></div>
        <div class="topSectionPersonInfo">
            <div>
                <p>Surname: ${voter.lastname}</p>
                <p>Given names: ${voter.firstname}</p>
            </div>
            <div>
                <p>Gender: ${voter.gender}</p>
                <p>Date of Birth: ${formatedDOB}</p>
                <p>Age: ${voter.age}</p>
            </div>
            <div>
                <p>Nationality: ${voter.country}</p>
                <p>State of Origin: ${voter.state}</p>
                <p>LGA: ${voter.lga}</p>
            </div>
            <p>NIN: ${voter.ninNumber}</p>
            <h5>VOTING ID: ${voter.votingID ? voter.votingID : 'Profile Not Approved'}</h5>
        </div>
        <div class="topSectionIDPhoto">
            <h4>Identity Card</h4>
            <img src="http://localhost:3000/${voter.uploadID}" alt="selfie-image" width="90%" height="250px">
        </div>
    </div>
    <div class="bottomSection">
            <table id='votersTable'>
            <thead>
                <tr>
                    <th>Requirement</th>
                    <th>Description</th>
                    <th>Verification Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>NIN</td>
                    <td>${voter.ninNumber}</td>
                    <td>${voter.isNINVerified ? 'Verified &#10004' : 'Pending &#8987'}</td>
                </tr>
                <tr>
                    <td>ID Card</td>
                    <td>idcard</td>
                    <td>${voter.isIdVerified ? 'Verified &#10004' : 'Pending &#8987'}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>${voter.email}</td>
                    <td>${voter.isEmailVerified ? 'Verified &#10004' : 'Pending &#8987'}</td>
                </tr>
                <tr>
                    <td>Phone Number</td>
                    <td>${voter.phonenumber}</td>
                    <td>${voter.isphonenumberVerified ? 'Verified &#10004' : 'Pending &#8987'}</td>
                </tr>
                <tr>
                    <td>Is Voter above 18 yeard?</td>
                    <td>${voter.age}</td>
                    <td>${voter.isDOBeligibleToVote ? 'Yes &#10004' : 'No &#8987'}</td>
                </tr>
            </tbody>
            </table>
        </div>
    <div id="voteActions">
        <select name="" id="selectVerificationStatus">
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Rejected">Rejected</option>
        </select>
        <button id="updateButton" type="button">Update</button>
    </div>
    `;
    const modal = document.getElementsByClassName("modal")[0];                     
    modal.style.display = 'block';

    // Close votes modal
    document.getElementsByClassName("close")[0].onclick = function() {
        const modal = document.getElementsByClassName("modal")[0];                     
        modal.style.display = 'none';
    };

    // Grab the selectVerificationStatus button; disabled Under Review when clicked
    document.getElementById('selectVerificationStatus').addEventListener('change', function() {
        var updateButton = document.getElementById('updateButton');
        updateButton.disabled = (this.value === 'Under Review');
    });

    // handleVerificationSubmit
    const handleVerificationSubmitButton = document.getElementById('updateButton');
    handleVerificationSubmitButton.addEventListener('click', () => {
        const selectedStatus = document.getElementById('selectVerificationStatus').value;
        const userId = voter._id;
        const verifiedBy = globalUserData._id;
        handleVerificationSubmit(userId, selectedStatus, verifiedBy)
    })
};
// handleVerificationSubmit
const handleVerificationSubmit = async (userId, selectedStatus, verifiedBy) => {
    try {
        const response = await fetch('http://localhost:3000/updateVoterStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, selectedStatus, verifiedBy }),
          credentials: 'include'
        });
        const data = await response.json();
        // if (!response.ok) throw new Error(data.error || 'Authorization failed');
        if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
        alert(data.message); 
        // Reload and open Voters tab
        location.reload();
        // window.location.href = window.location.origin + window.location.pathname + '?tab=Voters';
        // openTab(null, 'Voters');       
    } catch (error) {
        alert('Error: ' + error.message);
    }
}