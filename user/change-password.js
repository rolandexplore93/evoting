function showChangePasswordSuccessOrError() {
    document.getElementById('change-password').style.display = 'none';
    // document.getElementById('change-password-successful').style.display = 'none';
    // document.getElementById('change-password-successful').style.display = 'none';

    let x=1;
    if (x == 1) {
        document.getElementById('change-password-successful').style.display = 'block';
        document.getElementById('change-password-error').style.display = 'none';
    } else {
        document.getElementById('change-password-successful').style.display = 'none';
        document.getElementById('change-password-error').style.display = 'block';
    }
}

function showChangePassword() {
    document.getElementById('change-password').style.display = 'block';
    document.getElementById('change-password-successful').style.display = 'none';
    document.getElementById('change-password-error').style.display = 'none';
}