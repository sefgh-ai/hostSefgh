document.addEventListener('DOMContentLoaded', () => {
  // Check for user information in localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    // If the user is logged in, display their info and a logout button
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement) {
      userInfoElement.innerHTML = `
        <p>Welcome, ${user.displayName || user.email}!</p>
        <button id="logout-btn">Logout</button>
      `;

      // Add event listener for the logout button
      document.getElementById('logout-btn').addEventListener('click', () => {
        // Here you would add your Firebase logout logic
        // For now, we will just clear localStorage and redirect
        localStorage.removeItem('user');
        window.location.href = 'login.html';
      });
    }
  }
});