// Array dummy data to simulate fetched data from database
const voters = [
    { Surname: 'Smith', GivenNames: 'John Alex', Age: 35, VerificationProgress: '1/5', ProfileStatus: 'Rejected' },
    { Surname: 'Johnson', GivenNames: 'Lara Beth', Age: 42, VerificationProgress: '5/5', ProfileStatus: 'Approved' },
];

// console.log('yesllll')
function openAllVotersTable() {
    console.log('yes')
    const container = document.getElementsByClassName('votersTabContent')[0];
    console.log(container)
    let tableHTML = `<table>
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
    }
}

document.getElementById('defaultVotersPage').click()