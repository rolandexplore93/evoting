function goToAdminAccount() {
    alert('Authenticating and redirecting to Admin profile...');
    window.location = '/admin/admin-dashboard.html';
}







// class userPagesHeader extends HTMLElement {
//     connectedCallback() {
//         const dashboard = this.hasAttribute('dashboard');
//         const elections = this.hasAttribute('elections');
//         const electionResults = this.hasAttribute('electionResults');
//         const addParty = this.hasAttribute('addParty');
//         const createElection = this.hasAttribute('createElection');
//         const addCandidates = this.hasAttribute('addCandidates');
//         const voters = this.hasAttribute('voters');
//         const approveVote = this.hasAttribute('approveVote');
//         const logout = this.hasAttribute('logout');

//         this.innerHTML = `
//             <div class="user-header">
//                 <div class="logo"><a href="/index.html" target="_blank"><span class="fi fi-ng"></span> NEEV</a></div>
//                 <nav>
//                     <ul>
//                         ${dashboard ? '<li><a class=""tablinks" onclick="openTab(event, Dashboard)" id="defaultPage">Dashboard</a></li>' : ''}
//                         ${elections ? '<li><a class="tablinks" onclick="openTab(event, Election)">Elections</a></li>' : ''}
//                         ${electionResults ? '<li><a class="tablinks" onclick="openTab(event, Election-Results)">Election Results</a></li>' : ''}
//                     </ul>
//                 </nav>
//                 <div><a href="/election-results/electionresults.html">Election Results</a></div>
//                 ${logout ? '<button onclick="logout()">Logout</button>' : ''}
//             </div>
//         `;
//     }
// }

// customElements.define('user-pages-header', userPagesHeader);
