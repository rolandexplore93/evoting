function showLoginForm() {
    document.getElementById('signup').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    document.getElementById('signup-success').style.display = 'none';
}

function showSignupForm() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('signup').style.display = 'block';
    document.getElementById('signup-success').style.display = 'none';
}

document.getElementById('go-to-useraccount').onclick = function () {
    alert('Authenticating and redirecting to user profile...');
}

function register() {
    document.getElementById('signup').style.display = 'none';
    document.getElementById('signup-success').style.display = 'block';
    showSignupSuccess();
}

function showSignupSuccess() {
    document.getElementById('signup-success').style.display = 'block';
}


document.getElementById('go-to-login').onclick = function () {
    document.getElementById('signup-success').style.display = 'none';
    showLoginForm();
}

// When the user clicks on "Go to my profile", authenticate and redirect user to user profile
document.getElementById('go-to-profile').onclick = function () {
    alert('Authenticating and redirecting to user profile...');
}

window.onclick = function (event) {
    const modal = document.getElementById('signup-success');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}