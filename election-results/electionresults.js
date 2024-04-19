let electionsList2;
const eResultsContent = document.getElementById('eResultsContent');

document.addEventListener('DOMContentLoaded', async () => {
    const electionTabsContainer = document.getElementById('eTabs');
    const getElectionsWithPartiesAndCandidates = async () => {
        try {
            const response = await fetch('http://localhost:3000/getElectionsWithPartiesAndCandidatesInfo', {
                method: 'GET'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
            return data
        } catch (error) {
            console.error('Error:', error.message);
            alert(error.message)
        }
    }

    const allElectionsWithPartiesAndCandidates = await getElectionsWithPartiesAndCandidates() // uninitialized variable to hold election information
    
    electionsList2 = allElectionsWithPartiesAndCandidates.electionInfo;

    // Populate all created elections on the sidebar tabs
    if (electionsList2.length === 0) document.getElementById('main').innerHTML = '<h1>No election available</h1>';
    electionsList2.forEach((election, index) => {
        const tab = document.createElement('li');
        tab.textContent = `${election.electionCategory} - ${election.electionName}`;
        tab.setAttribute('data-election', election._id);
        tab.addEventListener('click', (e) => {

            // Remove the active class from all tabs
            document.querySelectorAll('#eTabs li').forEach(tab => {
                tab.classList.remove('active-tab')
            });

            // When a tab is clicked, add active class
            e.target.classList.add('active-tab');

            // get the data for approved votes for selectedt election
            getSelectedElectionResult(election._id)
        });
        electionTabsContainer.appendChild(tab);
        
        // Display the result for the first election created
        if (index === 0) {
            tab.click();
        }
    });
})

const getSelectedElectionResult = async (electionIdSelected) => {
    try {
        const response = await fetch('http://localhost:3000/approvedVotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ electionIdSelected }),
        });
        
        if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
        const data = await response.json();
        showElectionData(approvedVotes = data.votes, electionIdSelected)
    } catch (error) {
        // console.error('Error saving user vote');
        eResultsContent.innerHTML = '<h1>No result available yet for this election</h1>';
    }
}

function showElectionData(approvedVotes, electionIdSelected) {
    const election = electionsList2.find( e => e._id === electionIdSelected)
    if (!election) return eResultsContent.innerHTML = '<h1>No result available yet for this election</h1>';
    let totalVotesCast = 0;
    // Setup the election result table
    let tableHTML = `
    <table>
        <tr>
            <th>Party Name</th>
            <th>Party Logo</th>
            <th>Candidate Name</th>
            <th>Candidate Image</th>
            <th>Vote Counts</th>
        </tr>`;
    election.participatingParties.forEach(party => {
        const voteReceivedByParty = approvedVotes.filter(vote => vote.partyId === party._id);
        const candidate = election.participatingCandidates.find(candidate => candidate.partyId === party._id);
        const candidateName = candidate ? candidate.candidateName : 'No Name';
        const candidateImage = candidate ? `<img src="/backend/${candidate.candidateImage}" alt="${candidateName}" width="30px" height="30px">` : `<img src="/images/placeholder-image.jpeg" alt="${candidateName}" width="30px" height="30px">`;
        // Add row to the html table created above
        tableHTML += `
        <tr>
            <td>${party.partyAcronym} - ${party.name}</td>
            <td><img src="/backend/${party.partyLogo}" alt="${party.name}" width="30px" height="30px"></td>
            <td>${candidateName}</td>
            <td>${candidateImage}</td>
            <td>${voteReceivedByParty.length}</td>
        </tr>
        `;
        totalVotesCast += voteReceivedByParty.length;
    })

    tableHTML += `</table><p>Total Votes Cast: ${totalVotesCast}</p>`; // close the </table>
    eResultsContent.innerHTML = tableHTML;
}