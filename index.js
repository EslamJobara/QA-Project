
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navButtons = document.querySelector(".nav-buttons");
  const container = document.querySelector(".container");

  if (currentUser) {
    // User is logged in
    navButtons.innerHTML = `
      <span style="color: #0ff; margin-right: 15px; font-size: 1.1rem; align-self: center;">${currentUser.name}</span>
      <button class="btn-login" id="logoutBtn" style="cursor: pointer;">Logout</button>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.reload();
    });

    // Render Welcome and Results
    container.innerHTML = `
      <div style="position: relative; text-align: center; z-index: 10; pointer-events: none; animation: fadeIn 1s ease-in; margin-top: -20px;">
        <h1 style="color: #0ff; font-size: 2.5rem; text-shadow: 0 0 10px rgba(0, 255, 255, 0.5); margin: 0;">Welcome back, ${currentUser.name.split(" ")[0]}!</h1>
        <p style="font-size: 1.1rem; color: #ccc; margin-top: 10px;">Select a subject from the navbar, or click your previous results below.</p>
      <div id="resultsContainer" style="position: fixed; inset: 0; pointer-events: none; z-index: 5;"></div>
      <div id="analysisContainer" style="position: relative; margin-top: 55vh; width: 90%; max-width: 800px; margin-left: auto; margin-right: auto; z-index: 10; pointer-events: none; animation: fadeIn 1.5s ease-in; padding-bottom: 50px;"></div>
    `;

    loadUserResults();

  } else {
    // User is not logged in
    container.innerHTML = `
      <div style="text-align: center; padding: 50px; animation: fadeIn 1s ease-in;">
        <h1 style="color: #0ff; font-size: 3.5rem; margin-bottom: 20px; text-shadow: 0 0 15px rgba(0, 255, 255, 0.7);">Explore Your Brain</h1>
        <p style="font-size: 1.5rem; color: #ccc; max-width: 600px; margin: 0 auto 40px auto; line-height: 1.6;">
          Know your brain well. Take our interactive tests in Math, History, and Art to discover your true strengths.
        </p>
        <a href="auth/Register.html" class="btn-register" style="font-size: 1.2rem; padding: 15px 40px;">Get Started Now</a>
      </div>
    `;
  }
});

function loadUserResults() {
  const subjects = ["history", "math", "art", "sports", "science", "literature"];
  const resultsContainer = document.getElementById("resultsContainer");
  
  const subjectMeta = {
    math: { lobe: 'frontal', top: '22%', left: '10%' },
    science: { lobe: 'frontal', top: '50%', left: '5%' },
    history: { lobe: 'temporal', top: '78%', left: '10%' },
    art: { lobe: 'occipital', top: '22%', right: '10%' },
    sports: { lobe: 'parietal', top: '50%', right: '5%' },
    literature: { lobe: 'temporal', top: '78%', right: '10%' }
  };

  // Add global click handler for exam redirection
  window.handleExamClick = function(subject, isFinished) {
    if (isFinished) {
      localStorage.setItem('currentSubject', subject);
      window.location.href = 'exams/answers.html';
    } else {
      window.location.href = `exams/${subject}.html`;
    }
  };

  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      let completedExams = 0;
      let scores = { math: 0, science: 0, history: 0, art: 0, sports: 0, literature: 0 };

      subjects.forEach(subject => {
        const isExamFinished = localStorage.getItem(`isExamFinishedOf${subject}`) === "true";
        const subjectData = data[subject];
        let meta = subjectMeta[subject] || { lobe: 'frontal', top: '50%', left: '50%' };
        let positionStyle = meta.left ? `left: ${meta.left};` : `right: ${meta.right};`;
        
        let cardContent = "";
        let gradeColor = "#ccc"; // Default for unfinished

        if (isExamFinished) {
          completedExams++;
          const finalAnswers = JSON.parse(localStorage.getItem(`finalAnswersOf${subject}`)) || {};
          let score = 0;
          subjectData.forEach((q, i) => {
            if (finalAnswers[i] === q.rightanswer) {
              score++;
            }
          });

          const percentage = Math.round((score / subjectData.length) * 100);
          scores[subject] = percentage;
          
          gradeColor = percentage >= 50 ? "#00ff99" : "#ff4444";
          let message = percentage >= 50 ? "Great Job!" : "Needs Improvement";

          cardContent = `
            <h3 style="color: #fff; text-transform: capitalize; margin-top: 0; font-size: 1.3rem;">${subject}</h3>
            <div style="font-size: 2.5rem; font-weight: bold; color: ${gradeColor}; margin: 10px 0; text-shadow: 0 0 10px ${gradeColor}80;">${percentage}%</div>
            <p style="color: #ccc; margin-bottom: 5px; font-size: 1rem;">Score: ${score} / ${subjectData.length}</p>
            <p style="color: ${gradeColor}; font-weight: bold; margin: 0; font-size: 0.9rem;">${message}</p>
          `;
        } else {
          // Unfinished Exam Card
          gradeColor = "#0ff"; // Cyan for new tests
          cardContent = `
            <h3 style="color: #fff; text-transform: capitalize; margin-top: 0; font-size: 1.3rem;">${subject}</h3>
            <div style="font-size: 1.5rem; font-weight: bold; color: ${gradeColor}; margin: 15px 0; text-shadow: 0 0 10px ${gradeColor}80;">Not Taken</div>
            <p style="color: #ccc; margin-bottom: 5px; font-size: 0.9rem;">Click to Start</p>
          `;
        }

        resultsContainer.innerHTML += `
          <div 
            onmouseover="if(window.rotateBrainTo) window.rotateBrainTo('${meta.lobe}'); this.style.transform='translateY(-50%) scale(1.1)';" 
            onmouseout="if(window.rotateBrainTo) window.rotateBrainTo(null); this.style.transform='translateY(-50%) scale(1)';"
            onclick="handleExamClick('${subject}', ${isExamFinished})"
            style="position: absolute; top: ${meta.top}; ${positionStyle} transform: translateY(-50%); pointer-events: auto; cursor: pointer; background: rgba(30, 30, 47, 0.85); border: 2px solid ${gradeColor}; border-radius: 15px; padding: 20px; width: 220px; text-align: center; box-shadow: 0 0 20px ${gradeColor}40; transition: transform 0.3s;"
          >
            ${cardContent}
          </div>
        `;
      });

      // Render Scientific Personality Analysis if at least 1 exam is completed
      if (completedExams > 0) {
        renderPersonalityAnalysis(scores, completedExams);
      } else {
        document.getElementById("analysisContainer").innerHTML = `
          <div style="background: rgba(30, 30, 47, 0.85); border-radius: 15px; padding: 25px; text-align: center; border: 1px dashed #0ff; pointer-events: auto;">
            <p style="font-size: 1.2rem; color: #0ff; margin: 0;">Take your first test to reveal your Cognitive Personality Analysis!</p>
          </div>
        `;
      }
    })
    .catch(err => console.error("Error loading results:", err));
}

function renderPersonalityAnalysis(scores, completedExams) {
  const analysisContainer = document.getElementById("analysisContainer");
  
  // Calculate grouped intelligence scores based on Gardner's Theory
  const analyticalScore = (scores.math + scores.science) / 2;
  const creativeScore = (scores.art + scores.literature) / 2;
  const practicalScore = (scores.sports + scores.history) / 2;
  
  let dominantTrait = "";
  let description = "";
  let color = "";

  if (analyticalScore >= creativeScore && analyticalScore >= practicalScore) {
    dominantTrait = "Logical-Mathematical Thinker";
    color = "#00eaff";
    description = "You show high potential in structured reasoning, pattern recognition, and scientific logic.";
  } else if (creativeScore >= analyticalScore && creativeScore >= practicalScore) {
    dominantTrait = "Visual & Linguistic Creator";
    color = "#a78bfa";
    description = "You possess strong spatial intelligence and linguistic expression. Your cognitive strengths lie in creativity, empathy, and articulating complex emotions, heavily engaging the right-hemisphere and occipital/temporal networks.";
  } else {
    dominantTrait = "Kinesthetic & Contextual Explorer";
    color = "#00ff88";
    description = "You learn best through experience, movement, and understanding human contexts. You have strong bodily-kinesthetic and interpersonal intelligence, relying on the parietal lobe to connect physical action with deep historical context.";
  }

  // If they haven't taken enough exams, show a disclaimer
  let accuracyNote = completedExams < 6 ? 
    `<p style="font-size: 0.85rem; color: #ffcc00; margin-top: 10px;">* Take all 6 exams for a highly accurate cognitive profile.</p>` : 
    `<p style="font-size: 0.85rem; color: #00ff99; margin-top: 10px;">✔ Fully mapped cognitive profile based on 6 subjects.</p>`;

  analysisContainer.innerHTML = `
    <div style="background: rgba(10, 10, 20, 0.9); border: 1px solid ${color}; border-radius: 15px; padding: 25px; box-shadow: 0 0 20px ${color}40; pointer-events: auto; backdrop-filter: blur(10px);">
      <h4 style="color: ${color}; font-size: 1.2rem; margin-bottom: 15px;">${dominantTrait}</h4>
      <p style="color: #ccc; font-size: 1rem; line-height: 1.6; margin-bottom: 10px;">${description}</p>
      <p style="font-size: 0.8rem; color: #777; margin-bottom: 0;">
        <strong>Scientific Basis:</strong> Howard Gardner's Theory of Multiple Intelligences (1983) & Hemispheric Lateralization principles.
      </p>
      ${accuracyNote}
    </div>
  `;
}
