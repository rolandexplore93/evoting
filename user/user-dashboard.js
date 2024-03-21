// const verificationModal = document.getElementById('verification-modal');
const main = document.getElementsByClassName('main-content')[0];
const modal = document.getElementsByClassName('modal')[0];
const verifyEmailContent = document.getElementById('verify-email-content');
const verifyEmailSuccess = document.getElementById('verify-email-success');
const verifyEmailError = document.getElementById('verify-email-error');
const verifyPhoneContent = document.getElementById('verify-phone-content');
const verifyPhonenoSuccess = document.getElementById('verify-phoneno-success');
const verifyPhonenoError = document.getElementById('verify-phoneno-error');
const verifyEmailOTP = document.getElementById('verify-email-otp');
const verifyPhoneOTP = document.getElementById('verify-phone-otp');

function verifyEmail() {
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'block';
}

// emailotp enter code
verifyEmailOTP.onclick = function() {
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'none';
    verifyEmailSuccess.style.display = 'block';
}

//emailotp error
verifyEmailOTP.onclick = function() {
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'none';
    verifyEmailError.style.display = 'block';
}

//emailotp success done
document.getElementById('otp-email-success').onclick = function(){
    modal.style.display = 'none';
    verifyEmailContent.style.display = 'none';
    verifyEmailSuccess.style.display = 'none';
}

//emailotp error try again
document.getElementById('otp-email-error').onclick = function(){
    modal.style.display = 'block';
    verifyEmailContent.style.display = 'block';
    verifyEmailError.style.display = 'none';
}

//emailotp error cancel page
document.getElementById('go-to-dashboard').onclick = function(){
    modal.style.display = 'none';
    verifyEmailContent.style.display = 'none';
    verifyEmailError.style.display = 'none';
}

function verifyPhoneNumber() {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'block';
}

// phoneno enter code
verifyPhoneOTP.onclick = function() {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoSuccess.style.display = 'block';
}

//phoneno otp error
verifyPhoneOTP.onclick = function() {
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoError.style.display = 'block';
}

// phoneno success done
document.getElementById('otp-phone-success').onclick = function(){
    modal.style.display = 'none';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoSuccess.style.display = 'none';
}

//phoneno otp error try again
document.getElementById('otp-phone-error').onclick = function(){
    modal.style.display = 'block';
    verifyPhoneContent.style.display = 'block';
    verifyPhonenoError.style.display = 'none';
}

//phoneno otp error cancel page
document.getElementById('go-to-dashboard-now').onclick = function(){
    modal.style.display = 'none';
    verifyPhoneContent.style.display = 'none';
    verifyPhonenoError.style.display = 'none';
}

// Tab functionality
function openTab(e, tabTitle){
    var index, tabContent, tabLinks;

    tabContent = document.getElementsByClassName('tabcontent');
    for (index = 0; index < tabContent.length; index++) {
        tabContent[index].style.display = 'none';
    }

    tabLinks = document.getElementsByClassName('tablinks');
    for (index = 0; index < tabLinks.length; index++) {
        tabLinks[index].className = tabLinks[index].className.replace(" active", "");
    }

    document.getElementById(tabTitle).style.display = 'block';
    e.currentTarget.className += " active";
}