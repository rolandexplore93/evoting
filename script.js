class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="header">
                <div class="logo"><a href="/index.html"><span class="fi fi-ng"></span> NEEV</a></div>
                <nav>
                <ul>
                    <li><a href="/index.html">Home</a></li>
                    <li><a href="/admin/admin.html">Admin</a></li>
                    <li><a href="/user/user.html">Voter</a></li>
                </ul>
                </nav>
                <div><a href="/election-results/electionresults.html">Election Results</a></div>
            </div>
        `;
    }
}

customElements.define('page-header', Header);

class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="footer">&copy; NEEV 2024. Built by Orobola Roland: All rights reserved.</div>
        `;
    }
}

customElements.define('page-footer', Footer);

class UserPageHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="header">
                <div class="logo"><a href="/index.html" target="_blank"><span class="fi fi-ng"></span> NEEV</a></div>
                <nav>
                <ul>
                    <li><a href="/index.html">Dashboard</a></li>
                    <li><a href="/admin/admin.html">Elections</a></li>
                    <li><a href="/user/user.html">Election Results</a></li>
                </ul>
                </nav>
                <Button>Logout</Button>
            </div>
        `;
    }
}

customElements.define('userpage-header', UserPageHeader);