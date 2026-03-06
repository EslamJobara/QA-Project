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
        <p>Know your brain well. Take our interactive tests in Math, History, and Art to discover your true strengths.</p>
        <a href="auth/Register.html" class="btn-register">Get Started Now</a>
      </div>
    `;
  }
});

function loadUserResults() {
  const subjects = [
    "history",
    "math",
    "art",
    "sports",
    "science",
    "literature",
  ];
  const resultsContainer = document.getElementById("resultsContainer");

  const subjectMeta = {
    math: { lobe: "frontal1", top: "22%", left: "10%" },
    science: { lobe: "frontal2", top: "50%", left: "5%" },
    history: { lobe: "temporal", top: "78%", left: "10%" },
    art: { lobe: "occipital", top: "22%", right: "10%" },
    sports: { lobe: "parietal", top: "50%", right: "5%" },
    literature: { lobe: "temporal", top: "78%", right: "10%" },
  };

  window.handleExamClick = (subject, isFinished) => {
    if (isFinished) {
      localStorage.setItem("currentSubject", subject);
      window.location.href = "exams/answers.html";
    } else {
      window.location.href = `exams/${subject}.html`;
    }
  };

  fetch("questions.json")
    .then((res) => res.json())
    .then((data) => {
      let completedExams = 0;
      let scores = {};

      subjects.forEach((subject) => {
        scores[subject] = 0;
        const isFinished =
          localStorage.getItem(`isExamFinishedOf${subject}`) === "true";
        const meta = subjectMeta[subject] || {
          lobe: "frontal",
          top: "50%",
          left: "50%",
        };
        const positionStyle = meta.left
          ? `left: ${meta.left};`
          : `right: ${meta.right};`;

        let cardContent = "";
        let gradeColor = "#ccc";

        if (isFinished) {
          completedExams++;
          const finalAnswers =
            JSON.parse(localStorage.getItem(`finalAnswersOf${subject}`)) || {};
          let score = 0;
          data[subject].forEach((q, i) => {
            if (finalAnswers[i] === q.rightanswer) score++;
          });
          const percentage = Math.round((score / data[subject].length) * 100);
          scores[subject] = percentage;
          gradeColor = percentage >= 50 ? "#00ff99" : "#ff4444";
          const message = percentage >= 50 ? "Great Job!" : "Needs Improvement";

          cardContent = `
            <h3>${subject}</h3>
            <div class="score" style="color:${gradeColor}">${percentage}%</div>
            <p>Score: ${score} / ${data[subject].length}</p>
            <p style="color:${gradeColor}; font-weight:bold;">${message}</p>
          `;
        } else {
          gradeColor = "#0ff";
          cardContent = `
            <h3>${subject}</h3>
            <div class="score" style="color:${gradeColor}">Not Taken</div>
            <p>Click to Start</p>
          `;
        }

        resultsContainer.innerHTML += `
          <div 
            class="result-card"
            style="top: ${meta.top}; ${positionStyle}; border: 2px solid ${gradeColor}; box-shadow: 0 0 20px ${gradeColor}40;"
            onmouseover="if(window.rotateBrainTo) window.rotateBrainTo('${meta.lobe}');"
            onmouseout="if(window.rotateBrainTo) window.rotateBrainTo(null);"
            onclick="handleExamClick('${subject}', ${isFinished})"
          >
            ${cardContent}
          </div>
        `;
      });

      if (completedExams > 0) renderPersonalityAnalysis(scores, completedExams);
      else
        document.getElementById("analysisContainer").innerHTML = `
        <div class="analysis-box" style="border:1px dashed #0ff;">
          <p>Take your first test to reveal your Cognitive Personality Analysis!</p>
        </div>
      `;
    })
    .catch((err) => console.error(err));
}

function renderPersonalityAnalysis(scores, completedExams) {
  const analysisContainer = document.getElementById("analysisContainer");

  const analyticalScore = (scores.math + scores.science) / 2;
  const creativeScore = (scores.art + scores.literature) / 2;
  const practicalScore = (scores.sports + scores.history) / 2;

  let dominantTrait = "",
    description = "",
    color = "";

  if (analyticalScore >= creativeScore && analyticalScore >= practicalScore) {
    dominantTrait = "Logical-Mathematical Thinker";
    color = "#00eaff";
    description =
      "You show high potential in structured reasoning, pattern recognition, and scientific logic.";
  } else if (
    creativeScore >= analyticalScore &&
    creativeScore >= practicalScore
  ) {
    dominantTrait = "Visual & Linguistic Creator";
    color = "#a78bfa";
    description =
      "You possess strong spatial intelligence and linguistic expression.";
  } else {
    dominantTrait = "Kinesthetic & Contextual Explorer";
    color = "#00ff88";
    description =
      "You learn best through experience, movement, and understanding human contexts.";
  }

  let accuracyNote =
    completedExams < 6
      ? `<p style="color: #ffcc00; font-size:0.85rem;">* Take all 6 exams for a highly accurate cognitive profile.</p>`
      : `<p style="color: #00ff99; font-size:0.85rem;">✔ Fully mapped cognitive profile based on 6 subjects.</p>`;

  analysisContainer.innerHTML = `
    <div class="analysis-box" style="border:1px solid ${color}; box-shadow:0 0 20px ${color}40;">
      <h4 style="color:${color}">${dominantTrait}</h4>
      <p>${description}</p>
      <p style="font-size:0.8rem; color:#777;"><strong>Scientific Basis:</strong> Howard Gardner's Theory of Multiple Intelligences & Hemispheric Lateralization principles.</p>
      ${accuracyNote}
    </div>
  `;
}
