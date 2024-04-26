// This is a reusable header component that can be used on different pages
class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="header">
                <div class="logo"><a href="/index.html"><span class="fi fi-ng"></span> NEVS</a></div>
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
    };
};
customElements.define('page-header', Header);

// This is a reusable footer component that can be used on different pages
class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="footer">&copy; NEVS 2024. Built by Orobola Roland: All rights reserved.</div>
        `;
    };
};
customElements.define('page-footer', Footer);