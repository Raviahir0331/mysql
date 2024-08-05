document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Create a query string with the parameters
    const queryString = new URLSearchParams({
        name: name,
        pass: pass
    }).toString();

    try {
        const response = await fetch(`http://localhost:5000/login?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Login successful!');
            window.location.href = 'index.html'; // Redirect to another page
        } else {
            alert('Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
