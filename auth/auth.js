document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navButtons = document.querySelector(".header__actions");
  const container = document.querySelector(".container");

  if (currentUser) {
    navButtons.innerHTML = `
      <span>${currentUser.name}</span>
      <button class="header__btn--login" id="logoutBtn">Logout</button>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.reload();
    });

    container.innerHTML = `
      <div class="welcome">
        <h1 class="welcome__title">Welcome back, ${currentUser.name.split(" ")[0]}!</h1>
      </div>
      <div id="resultsContainer" class="results"></div>
      <div id="analysisContainer" class="analysis"></div>
    `;

    loadUserResults();
  } else {
    container.innerHTML = `
      <div class="welcome">
        <h1 class="welcome__title">Explore Your Brain</h1>
        <p class="welcome__description">Know your brain well. Take our interactive tests and discover your true strengths.</p>
        <a href="auth/Register.html" class="welcome__link">Get Started Now</a>
      </div>
    `;
  }
});
