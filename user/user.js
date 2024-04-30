// Get target HTML elements
const signup = document.getElementById('signup');
const login = document.getElementById('login');
const signupSuccess = document.getElementById('signup-success');
const resetPassword = document.getElementById('reset-password');
const resetPasswordSucsess = document.getElementById('reset-password-success');
const loginOrSignup = document.getElementById('login-or-signup');
const form = document.getElementById('form');
const loginFormDisplay = document.getElementById('login-form-display');
const signupFormDisplay = document.getElementById('signup-form-display');
const nin = document.getElementById('nin');

loginFormDisplay.classList.add('activeDisplay'); // Add active style to login form

// Function to display login form
function showLoginForm() {
    signup.style.display = 'none';
    form.style.display = 'block';
    login.style.display = 'block';
    signupSuccess.style.display = 'none'; 
    resetPassword.style.display = 'none';
    resetPasswordSucsess.style.display = 'none';
    loginFormDisplay.classList.add('activeDisplay')
    signupFormDisplay.classList.remove('activeDisplay')
}
// Function to display registration form
function showSignupForm() {
    login.style.display = 'none';
    signup.style.display = 'block';
    signupSuccess.style.display = 'none';
    resetPassword.style.display = 'none';
    resetPasswordSucsess.style.display = 'none';
    loginFormDisplay.classList.remove('activeDisplay')
    signupFormDisplay.classList.add('activeDisplay')
}
// Function to display show reset password form
function showResetPassword () {
    resetPassword.style.display = 'block';
    login.style.display = 'none';
    signup.style.display = 'none';
    signupSuccess.style.display = 'none';
    loginOrSignup.style.display = 'none';
    resetPasswordSucsess.style.display = 'none';
}
// reset-password-form function
const resetPasswordForm = document.getElementById('reset-password-form');
resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showResetPasswordSuccess()
})
// Function to display show reset password success card
function showResetPasswordSuccess() {
    resetPasswordSucsess.style.display = 'block';
    resetPassword.style.display = 'none';
    login.style.display = 'none';
    signup.style.display = 'none';
    signupSuccess.style.display = 'none';
    loginOrSignup.style.display = 'none';
}

// Function: When the OK button is clicked after the indication that reset link 
// has been sent to the user, redirect user to the login page
function resetPasswordOk() {
    window.location.href = '/user/user.html';
}


document.getElementById('go-to-login').onclick = function () {
    signupSuccess.style.display = 'none';
    form.style.display = 'block';
    login.style.display = 'block';
    showLoginForm();
}

const modal = document.getElementsByClassName('modal')[0];
const modalContent = document.getElementsByClassName('modal-content');

const closeModal = document.getElementsByClassName('close')[0];
closeModal.onclick = function() {
    login.style.display = 'block';
    modal.style.display = 'none';
    form.style.display = 'block';
    showLoginForm();
}


// LOGIN logic
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // window.location.href = `${window.location.origin}${data.path}`;
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
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

// Verify NIN and populate user information to the signup form
const validateUserNIN = async () => {
    const nin = document.getElementById('nin').value;
    const ninHTML = document.getElementById('nin');
    const guidedText = document.getElementById('guide-text');
    const formSection2 = document.getElementById('form-section-2');
    // NIN internal requirement: Do not accept NIN that starts with 0 and 9.
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
    // Make an api to validate NIN on the backend 
    await fetch('http://localhost:3000/validatenin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(ninData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success == false) { // If NIN already exists
            guidedText.textContent = data.message;
            guidedText.style.color = 'red';

            setTimeout(() => {
                guidedText.textContent = 'NIN must be numeric';
                guidedText.style.color = 'inherit';
                document.getElementById('validateNIN').style.display = 'block';
            }, 800)
            return
        }
        // If NIN doesn't exist, user information is retrieved and populated in an HTML form from the DOM using String literals
        guidedText.textContent = data.message;
        guidedText.style.color = 'green';
        document.getElementById('validateNIN').style.display = 'none';
        ninHTML.textContent = data.userData.ninNumber;
        ninHTML.setAttribute('readonly', 'readonly');
        setTimeout(() => { // Display the registration form after 1 seconds
            formSection2.style.display = 'block';
            formSection2.innerHTML = `
                <div class="entry-wrapper">Lastname: 
                    <input class="inputField" type="text" id="lastname" name="lastname" placeholder="Lastname" value='${data.userData.lastName}' readonly required>
                </div>
                <div class="entry-wrapper">Firstname: 
                    <input class="inputField" type="text" id="firstname" name="firstname" placeholder="Firstname" value='${data.userData.firstName}' readonly required>
                </div>
                <div class="entry-wrapper">Username:
                    <input class="inputField" type="text" id="username" name="username" placeholder="Username" value='${data.userData.username}' readonly required>
                </div>
                <div class="entry-wrapper">Date of Birth:
                    <input class="inputField" type="date" name="dateOfBirth" id="dob">
                </div>
                <div class="entry-wrapper">
                    <div>State:
                        <select id="state-dropdown" name="state" onchange="updateLGA()" readonly>
                            <option id="state" value="${data.userData.state}">${data.userData.state}</option>
                        </select>
                    </div>
                    <div>LGA:
                        <select id="lga-dropdown" name="lga" readonly>
                            <option id="lga" value="${data.userData.lga}">${data.userData.lga}</option>
                        </select>
                    </div>
                    <div>Gender:
                        <select id="gender" name="gender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="others">Others</option>
                            <option value="ns">Not Specified</option>
                        </select>
                    </div>
                </div>
                <div class="entry-wrapper">Email:
                    <input class="inputField" type="email" id="userEmail" name="email" placeholder="Email" value='${data.userData.email}' required>
                </div>
                <div class="entry-wrapper">Phone Number:
                    <input class="inputField" type="text" id="phonenumber" name="phonenumber" placeholder="Phone Number" value='${data.userData.phoneNumber}' required>
                </div>
                <div class="entry-wrapper">Password:
                    <input class="inputField" type="password" id="userPassword" name="password" placeholder="Password" required>
                </div>
                <div class="entry-wrapper upload"><p>Upload ID card</p>
                    <input class="inputField" type="file" name="uploadID" id="uploadID" accept="image/*" required>
                </div>
                <div class="entry-wrapper upload"><p>Upload Selfie (plain background only)</p>
                    <input class="inputField" type="file" name="uploadSelfie" id="uploadSelfie" accept="image/*" required>
                </div>
                    <button type="submit" id="registerButton" disabled>Register</button>
                </div>
            `
            listenForClickOnRegisterForm(); // Enable or disabled register button when all fields are filled or not 
        }, 1000);
    })
    .catch(error => {
        console.log(error)
    })
};

// Enable register button when all fields are filled 
const listenForClickOnRegisterForm = () => {
    const inputs = document.querySelectorAll('.inputField');
    const registerButton = document.getElementById('registerButton');
    const toggleButtonState = () => {
        // Check if all inputs have a value
        const allInputFilled = Array.from(inputs).every(input => input.value.trim() !== '');
        // Enable or disable the register button based on the fields being filled
        registerButton.disabled = !allInputFilled;
    };
    // Add event listeners to each input field
    inputs.forEach(input => {
        input.addEventListener('input', toggleButtonState);
    });
}

// Send user entries to the server for registration
const formElement = document.getElementsByClassName('signup-form')[0];
formElement.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(formElement);

    // Console user entries in formData to the console for confirmation
    // for (item of formData) {
    //     console.log(item[0], item[1])
    // }

    try {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            body: formData // FormData will be sent as 'multipart/form-data'
        })
        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`${data.message} Status: ${response.status}, Message: ${errorText}`);
        }
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        // console.error('Error:', error);
        alert('Error occured: ' + error.message);
    }

})