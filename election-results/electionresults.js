
document.addEventListener('DOMContentLoaded', () => {
    const electionTabsContainer = document.getElementById('eTabs');
    const eResultsContent = document.getElementById('eResultsContent');

    const electionsList = ['General Election - President 2024', 'General Election - Senate 2024', 'States Election - Governor 2024'];
    const electionsData = {
        'General Election - President 2024': [
            { partyName: 'PDP', partyLogo: 'pdp.jpg', candidateName: 'John Doe', candidateLogo: 'john.jpg', totalVotes: 2000 },
            { partyName: 'APC', partyLogo: 'apc.jpg', candidateName: 'Jane Doe', candidateLogo: 'jane.jpg', totalVotes: 1500 },
            { partyName: 'LP', partyLogo: 'lp.jpg', candidateName: 'Jim Beam', candidateLogo: 'jim.jpg', totalVotes: 2500 }
        ],
    };

    // Populate all created elections on the sidebar tabs
    electionsList.forEach((election, index) => {
        const tab = document.createElement('li');
        tab.textContent = election;
        tab.setAttribute('data-election', election);
        tab.addEventListener('click', (e) => {

            // Remove the active class from all tabs
            document.querySelectorAll('#eTabs li').forEach(tab => {
                tab.classList.remove('active-tab')
            });

            // When a tab is clicked, add active class
            e.target.classList.add('active-tab')

            showElectionData(election)
        });
        electionTabsContainer.appendChild(tab);
        
        // Display the result for the first election created
        if (index === 0) {
            tab.click();
        }
    });

    function showElectionData(electionType) {
        const electionResultData = electionsData[electionType];
        if (!electionResultData) {
            eResultsContent.innerHTML = `<p>No result available for ${electionType}</p>`
        } else {

        let tableHTML = `<table><caption>${electionType}</caption><tr><th>Party Name</th><th>Party Logo</th><th>Candidate Name</th><th>Candidate Logo</th><th>Total Votes Received</th></tr>`;

        let totalVotesCast = 0;

        // electionResultData && 
        electionResultData.forEach(row => {
            tableHTML += `
                <tr>
                    <td>${row.partyName}</td>
                    <td><img src="" alt="${row.partyName}" style="width: 50px;"></td>
                    <td>${row.candidateName}</td>
                    <td><img src="" alt="${row.candidateName}" style="width: 50px;"></td>
                    <td>${row.totalVotes}</td>
                </tr>
            `;
            totalVotesCast += row.totalVotes;
        });

        tableHTML += `</table><p>Total Votes Cast: ${totalVotesCast}</p>`;
        eResultsContent.innerHTML = tableHTML
    }}

})