const users = [
    { username: "Mi Luz", password: "0710226244" },
    { username: "Luna", password: "0768055569" }
];

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Store the username in sessionStorage
        sessionStorage.setItem('currentUser', user.username);
        // Redirect to main page
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password');
    }
});

// Prevent going back to login page if already logged in
if (sessionStorage.getItem('currentUser')) {
    window.location.href = 'index.html';
} 