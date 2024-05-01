// Target the login button, get admin entries and make a call to the login API server
// to verify and confirm admin login details if they are valid or not
const loginToAdminPageButton = document.getElementById('loginToAdminPageButton');
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async(e) => {
    e.preventDefault(); // Prevent form from refresh after submission
    const username = document.getElementById('username').value;
    const pin = document.getElementById('pin').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('http://localhost:3000/adminLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, pin, password }),
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(`${data.message}, statusCode: ${response.status}`);
        if (data.success) {
            // Redirect based on role to the admin portal after successful login
            alert(data.message);
            window.setTimeout(() => {
                window.location.href = `${window.location.origin}${data.path}`;
            }, 1000);
        } else {
            alert(data.message)
            window.location.href = `${window.location.origin}${data.path}`;
        }
    } catch (error) {
        alert('Login Failed! ' + error.message);
        // console.error('Login Failed! ' + error.message);
    }
})