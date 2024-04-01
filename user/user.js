const signup = document.getElementById('signup');
const login = document.getElementById('login');
const signupSuccess = document.getElementById('signup-success');
const resetPassword = document.getElementById('reset-password');
const resetPasswordSucsess = document.getElementById('reset-password-success');
const loginOrSignup = document.getElementById('login-or-signup');
const form = document.getElementById('form');
const loginFormDisplay = document.getElementById('login-form-display');
const signupFormDisplay = document.getElementById('signup-form-display');

loginFormDisplay.classList.add('activeDisplay')


function showLoginForm() {
    signup.style.display = 'none';
    login.style.display = 'block';
    signupSuccess.style.display = 'none';
    resetPassword.style.display = 'none';
    resetPasswordSucsess.style.display = 'none';
    loginFormDisplay.classList.add('activeDisplay')
    signupFormDisplay.classList.remove('activeDisplay')
}

function showSignupForm() {
    login.style.display = 'none';
    signup.style.display = 'block';
    signupSuccess.style.display = 'none';
    resetPassword.style.display = 'none';
    resetPasswordSucsess.style.display = 'none';
    loginFormDisplay.classList.remove('activeDisplay')
    signupFormDisplay.classList.add('activeDisplay')
}

function showResetPassword () {
    resetPassword.style.display = 'block';
    login.style.display = 'none';
    signup.style.display = 'none';
    signupSuccess.style.display = 'none';
    loginOrSignup.style.display = 'none';
    resetPasswordSucsess.style.display = 'none';
}

function register() {
    // signup.style.display = 'none';
    signupSuccess.style.display = 'block';
    form.style.display = 'none';
    // showSignupSuccess();
}

// function showSignupSuccess() {
//     signupSuccess.style.display = 'block';
// }

function showResetPasswordSuccess() {
    resetPasswordSucsess.style.display = 'block';
    resetPassword.style.display = 'none';
    login.style.display = 'none';
    signup.style.display = 'none';
    signupSuccess.style.display = 'none';
    loginOrSignup.style.display = 'none';
}


document.getElementById('go-to-login').onclick = function () {
    signupSuccess.style.display = 'none';
    form.style.display = 'block';
    login.style.display = 'block';
    showLoginForm();
}

// When the user clicks on "Go to my profile", authenticate and redirect user to user profile
// document.getElementById('go-to-profile').onclick = function () {
//     alert('Authenticating and redirecting to user profile...');
// }
const modal = document.getElementsByClassName('modal')[0];
console.log(modal)
const modalContent = document.getElementsByClassName('modal-content');

const closeModal = document.getElementsByClassName('close')[0];
closeModal.onclick = function() {
    login.style.display = 'block';
    modal.style.display = 'none';
    form.style.display = 'block';
    showLoginForm();
}


// LOGIN logic
document.getElementById('go-to-useraccount').onclick = function () {
    alert('Authenticating and redirecting to user profile...');
    window.location = '/user/user-dashboard.html';
}

// const loginForm = document.getElementById('login-form');
// loginForm.addEventListener('submit', function(e) {
//     e.preventDefault();

//     // Get the form data
//     const formData = new FormData(loginForm);
//     const email = formData.get('email')
//     console.log(email)

// })

// SIGNUP LOGIC
// Check whether NIN input is valid or not. Then enable submission button if it's valid
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const validateNIN = document.getElementById('validateNIN');

    signupForm.addEventListener('input', () => {
        if (signupForm.checkValidity()) {
            validateNIN.removeAttribute('disabled')
        } else {
            validateNIN.setAttribute('disabled', 'disabled')
        }
    })
});

const validateUserNIN = async () => {
    const nin = document.getElementById('nin').value;
    const guidedText = document.getElementById('guide-text');
    
    const ninFirst = nin[0]
    if (ninFirst == 0 || ninFirst == 9) {
        guidedText.textContent = 'NIN is not valid';
        guidedText.style.color = 'red';

        setTimeout(() => {
            guidedText.textContent = 'NIN must be numeric';
            guidedText.style.color = 'inherit';
        }, 1000)
        return
    }

    await fetch('/backend/validate-nin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(nin)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error)
    })
}





