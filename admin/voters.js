let voters;

// document.addEventListener('DOMContentLoaded', async () => {
    
// })
const votersTabHeader = document.getElementById('votersTabHeader');
votersTabHeader.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/allVoterUsers', {
            method: 'GET',
            credentials: 'include'
        });

        const data =  await response.json();
        console.log(data)
        if (!response.ok) {
            throw new Error(data.error || 'Authorization failed');
        }

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

        const userData = data.userInfo;
        voters = userData;
        console.log(voters)
        // populateUserData(userData)
    } catch (error) {
        console.error('Error:', error);
        alert('Not Authorized to access this page! Please login')
        window.location.href = '/admin/admin.html';
    }
})

// Array dummy data to simulate fetched data from database
// const voters = [
//     { Surname: 'Smith', GivenNames: 'John Alex', Age: 35, VerificationProgress: '1/5', ProfileStatus: 'Rejected' },
//     { Surname: 'Johnson', GivenNames: 'Lara Beth', Age: 42, VerificationProgress: '5/5', ProfileStatus: 'Approved' },
//     { Surname: 'John', GivenNames: 'Doe', Age: 22, VerificationProgress: '4/5', ProfileStatus: 'Under Review' },
// ];
// All Voters list
function openAllVotersTable() {
    const container = document.getElementsByClassName('votersTabContent')[0];
    let tableHTML = `<table id='votersTable'>
                        <thead>
                            <tr>
                                <th>Surname</th>
                                <th>Given Names</th>
                                <th>Age</th>
                                <th>User Role</th>
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
                        <td>${voter.role}</td>
                        <td>${voter.isProfileVerified}</td>
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
                        <td><button onclick="openVotersModal(${index})">View</button></td>
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
                        <td><button onclick="openVotersModal(${index})">View</button></td>
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

// OPEN MODAL
function openVotersModal(index) {
    const voter = voters[index];
    const modalContent = document.getElementById("modal-content-voters");
    // Update the modal content with voter details
    modalContent.innerHTML = `
    <span class="close">&times;</span>
    <div class="topSection">
        <div class="topSectionSelfie"><img src="/images/placeholder-image.jpeg" alt="" width="300px" height="300px"></div>
        <div class="topSectionPersonInfo">
            <div>
                <p>Surname: ${voter.Surname}</p>
                <p>Given names: ${voter.GivenNames}</p>
            </div>
            <div>
                <p>Gender: ${voter.Surname}</p>
                <p>Date of Birth: ${voter.Age}</p>
                <p>Age: ${voter.Age}</p>
            </div>
            <div>
                <p>Nationality: ${voter.Surname}</p>
                <p>State of Origin: ${voter.Age}</p>
                <p>LGA: ${voter.Age}</p>
            </div>
            <p>NIN: ${voter.Age}</p>
        </div>
        <div class="topSectionIDPhoto">
            <img src="/images/placeholder-image.jpeg" alt="" width="100%" height="300px">
            <button>Verify ID</button>
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
                    <td>NIN ${voter.Age}</td>
                    <td>22378482${voter.Age}</td>
                    <td>Verified${voter.Age}</td>
                </tr>
                <tr>
                    <td>ID Card ${voter.Age}</td>
                    <td>22378482${voter.Age}</td>
                    <td>Verified${voter.Age}</td>
                </tr>
                <tr>
                    <td>Email ${voter.Age}</td>
                    <td>22378@ga.com${voter.Age}</td>
                    <td>Verified${voter.Age}</td>
                </tr>
                <tr>
                    <td>Phone Number ${voter.Age}</td>
                    <td>23422378482${voter.Age}</td>
                    <td>Verified${voter.Age}</td>
                </tr>
                <tr>
                    <td>Is Voter above 18 yeard? ${voter.Age}</td>
                    <td>02/04/1994${voter.Age}</td>
                    <td>Yes${voter.Age}</td>
                </tr>
            </tbody>
            </table>
        </div>
    <div id="voteActions">
        <select name="" id="">
            <option value="approved">Approved</option>
            <option value="underReview">Under Review</option>
            <option value="rejected">Rejected</option>
        </select>
        <button>Update</button>
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