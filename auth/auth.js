document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navButtons = document.querySelector(".nav-buttons");
  const container = document.querySelector(".container");

  if (currentUser) {
    navButtons.innerHTML = `
      <span>${currentUser.name}</span>
      <button class="btn-login" id="logoutBtn">Logout</button>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.reload();
    });

    container.innerHTML = `
      <div class="welcome-container">
        <h1>Welcome back, ${currentUser.name.split(" ")[0]}!</h1>
      </div>
      <div id="resultsContainer"></div>
      <div id="analysisContainer"></div>
    `;

    loadUserResults();
  } else {
    container.innerHTML = `
      <div class="welcome-container">
        <h1>Explore Your Brain</h1>
        <p>Know your brain well. Take our interactive tests and discover your true strengths.</p>
        <a href="auth/Register.html">Get Started Now</a>
      </div>
    `;
  }
});
