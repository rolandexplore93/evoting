const loginToAdminPageButton = document.getElementById('loginToAdminPageButton');
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const pin = document.getElementById('pin').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/adminLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, pin, password }),
            credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
            // Redirect based on role
            alert(data.message);
            window.setTimeout(() => {
                window.location.href = `${window.location.origin}${data.path}`;
            }, 1000);
        } else {
            alert(data.message);
            window.location.href = `${window.location.origin}${data.path}`;
        }
    } catch (error) {
        console.error('Login failed');
    }
})































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
