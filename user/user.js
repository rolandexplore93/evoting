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

loginFormDisplay.classList.add('activeDisplay');

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
const modalContent = document.getElementsByClassName('modal-content');

const closeModal = document.getElementsByClassName('close')[0];
closeModal.onclick = function() {
    login.style.display = 'block';
    modal.style.display = 'none';
    form.style.display = 'block';
    showLoginForm();
}


// LOGIN logic
// document.getElementById('go-to-useraccount').onclick = function () {
//     alert('Authenticating and redirecting to user profile...');
//     window.location = '/user/user-dashboard.html';
// }

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
        console.log(data)
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
        if (data.success == false) {
            guidedText.textContent = data.message;
            guidedText.style.color = 'red';

            setTimeout(() => {
                guidedText.textContent = 'NIN must be numeric';
                guidedText.style.color = 'inherit';
                document.getElementById('validateNIN').style.display = 'block';
            }, 800)
            return
        }

        guidedText.textContent = data.message;
        guidedText.style.color = 'green';
        document.getElementById('validateNIN').style.display = 'none';
        ninHTML.textContent = data.userData.ninNumber;
        ninHTML.setAttribute('disabled', 'disabled');
        setTimeout(() => {
            formSection2.style.display = 'block';
            formSection2.innerHTML = `
                <div class="entry-wrapper">Lastname: 
                    <input class="inputField" type="text" id="lastname" placeholder="Lastname" value='${data.userData.lastName}' disabled required>
                </div>
                <div class="entry-wrapper">Firstname: 
                    <input class="inputField" type="text" id="firstname" placeholder="Firstname" value='${data.userData.firstName}' disabled required>
                </div>
                <div class="entry-wrapper">Username:
                    <input class="inputField" type="text" id="username" placeholder="Username" value='${data.userData.username}' disabled required>
                </div>
                <div class="entry-wrapper">Date of Birth:
                    <input class="inputField" type="date" name="dob" id="dob">
                </div>
                <div class="entry-wrapper">
                    <div>State:
                        <select id="state-dropdown" onchange="updateLGA()" disabled>
                            <option id="state" value="${data.userData.state}">${data.userData.state}</option>
                        </select>
                    </div>
                    <div>LGA:
                        <select id="lga-dropdown" disabled>
                            <option id="lga" value="${data.userData.lga}">${data.userData.lga}</option>
                        </select>
                    </div>
                    <div>Gender:
                        <select id="gender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="others">Others</option>
                            <option value="ns">Not Specified</option>
                        </select>
                    </div>
                </div>
                <div class="entry-wrapper">Email:
                    <input class="inputField" type="email" id="userEmail" placeholder="Email" value='${data.userData.email}' required>
                </div>
                <div class="entry-wrapper">Phone Number:
                    <input class="inputField" type="text" id="phonenumber" placeholder="Phone Number" value='${data.userData.phoneNumber}' required>
                </div>
                <div class="entry-wrapper">Password:
                    <input class="inputField" type="password" id="userPassword" placeholder="Password" required>
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
            listenForClickOnRegisterForm();
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
    console.log(inputs)

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

// const signupForm = document.getElementById('signup-form').addEventListener('submit', (e) => {
//     e.preventDefault()
//     console.log('ssssss')
// })

// const register = async () => {
const signupForm = document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    // signup.style.display = 'none';
    const formData = new FormData();
    formData.append('ninNumber', document.getElementById('nin').value);
    formData.append('lastname', document.getElementById('lastname').value);
    formData.append('firstname', document.getElementById('firstname').value);
    formData.append('username', document.getElementById('username').value);
    formData.append('dateOfBirth', document.getElementById('dob').value);
    formData.append('state', document.getElementById('state').value);
    formData.append('lga', document.getElementById('lga').value);
    formData.append('email', document.getElementById('userEmail').value);
    formData.append('phonenumber', document.getElementById('phonenumber').value);
    formData.append('gender', document.getElementById('gender').value);
    formData.append('password', document.getElementById('userPassword').value);

    // // Append files to formData
    formData.append('uploadID', document.getElementById('uploadID').files[0]);
    formData.append('uploadSelfie', document.getElementById('uploadSelfie').files[0]);

    await fetch('http://localhost:3000/signup', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle response data
        console.log(data);

        if (!data.success) {
            alert(data.message);
            window.location.href = '/user/user.html';
        }

        // alert('Account creation is successful');
        alert(data.message);
        form.style.display = 'none';
        signupSuccess.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
    });
    // showSignupSuccess();


    // alert('Account creation is successful');
    // form.style.display = 'none';
    // signupSuccess.style.display = 'block';
// }
})







// Frontend constructs full URL and redirects
// window.location.href = `${window.location.origin}${data.path}`;

    // const ninNumber = nin.value;
    // const lastname = document.getElementById('lastname').value;
    // const firstname = document.getElementById('firstname').value;
    // const username = document.getElementById('username').value;
    // const dateOfBirth = document.getElementById('dob').value;
    // const state = document.getElementById('state').value;
    // const lga = document.getElementById('lga').value;
    // const email = document.getElementById('userEmail').value;
    // const phonenumber = document.getElementById('phonenumber').value;
    // const gender = document.getElementById('gender').value;
    // const password = document.getElementById('userPassword').value;
    // const uploadID = document.getElementById('uploadID').files[0];
    // const uploadSelfie = document.getElementById('uploadSelfie').files[0];

    // console.log(ninNumber)
    // console.log(lastname);
    // console.log(firstname);
    // console.log(username);
    // console.log(dateOfBirth);
    // console.log(state);
    // console.log(lga);
    // console.log(email);
    // console.log(phonenumber);
    // console.log(gender);
    // console.log(password);
    // console.log(uploadID);
    // console.log(uploadSelfie);











