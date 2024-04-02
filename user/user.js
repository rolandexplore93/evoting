const signup = document.getElementById('signup');
const login = document.getElementById('login');
const signupSuccess = document.getElementById('signup-success');
const resetPassword = document.getElementById('reset-password');
const resetPasswordSucsess = document.getElementById('reset-password-success');
const loginOrSignup = document.getElementById('login-or-signup');
const form = document.getElementById('form');
const loginFormDisplay = document.getElementById('login-form-display');
const signupFormDisplay = document.getElementById('signup-form-display');

loginFormDisplay.classList.add('activeDisplay');

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
    const ninHTML = document.getElementById('nin');
    const guidedText = document.getElementById('guide-text');
    const formSection2 = document.getElementById('form-section-2');
    
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

    const ninData = { ninDigit: nin }

    await fetch('http://localhost:3000/validatenin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(ninData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.status == false) {
            guidedText.textContent = 'NIN already exist and linked to another user. Please enter your NIN';
            guidedText.style.color = 'red';

            setTimeout(() => {
                guidedText.textContent = 'NIN must be numeric';
                guidedText.style.color = 'inherit';
            }, 1000)
            return
        }

        guidedText.textContent = data.message;
        guidedText.style.color = 'green';
        document.getElementById('validateNIN').style.display = 'none';
        ninHTML.textContent = data.userData;
        ninHTML.setAttribute('disabled', 'disabled');
        setTimeout(() => {
            formSection2.style.display = 'block';
            formSection2.innerHTML = `
                <input type="text" placeholder="Surname" value='${data.userData.lastName}' disabled>
                <input type="text" placeholder="Firstname" value='${data.userData.firstName}' disabled>
                <input type="text" placeholder="Other names" value='${data.userData.username}' disabled>
                <input type="date" name="dob" id="dob">
                <select id="state-dropdown" onchange="updateLGA()">
                    <option value="">Select State</option>
                </select>
                <select id="lga-dropdown">
                    <option value="">Select LGA</option>
                </select>
                <input type="email" placeholder="Email">
                <input type="password" placeholder="Password">
                <label for="uploadID">Upload ID card
                    <input type="file" name="uploadID" id="uploadID" accept="image/*">
                </label>
                <button>Upload Selfie (plain background only)</button>
                <button onclick="register()">Register</button>
            `

        }, 1500)
    })
    .catch(error => {
        console.log(error)
    })
}





