// Display the cards when change password is successful or not. NO LOGIC IMPLEMENTED YET
function showChangePasswordSuccessOrError() {
    document.getElementById('change-password').style.display = 'none';
    let x=1;
    if (x == 1) { // Successful password change
        document.getElementById('change-password-successful').style.display = 'block';
        document.getElementById('change-password-error').style.display = 'none';
    } else { // Password change is not successful
        document.getElementById('change-password-successful').style.display = 'none';
        document.getElementById('change-password-error').style.display = 'block';
    }
}

// Function to display only the change password form
function showChangePassword() {
    document.getElementById('change-password').style.display = 'block';
    document.getElementById('change-password-successful').style.display = 'none';
    document.getElementById('change-password-error').style.display = 'none';
}