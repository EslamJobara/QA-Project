let container = document.getElementById("answersContainer");
let scoreBox = document.getElementById("score");

let currentSubject = localStorage.getItem("currentSubject");
const finalAnswers =
  JSON.parse(localStorage.getItem(`finalAnswersOf${currentSubject}`)) || {};

fetch("../questions.json")
  .then((res) => res.json())
  .then((data) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      const warning = document.getElementById("subjectWarning");
      warning.textContent = "You must be logged in to show the result!";
      warning.style.display = "block";
      setTimeout(() => {
        window.location.href = "../auth/Login.html";
      }, 2000);
      return;
    }
    const subjectData = data[currentSubject];

    let score = 0;

    subjectData.forEach((q, i) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "results__item";

      const title = document.createElement("h3");
      title.className = "results__item-title";
      title.textContent = `Q${i + 1}: ${q.question}`;
      questionDiv.appendChild(title);

      q.answers.forEach((ans) => {
        const ansDiv = document.createElement("div");
        ansDiv.className = "results__answer";
        ansDiv.textContent = ans;

        if (ans === q.rightanswer) ansDiv.classList.add("results__answer--correct");
        if (finalAnswers[i] === ans) {
          ansDiv.classList.add("results__answer--user");
          if (ans !== q.rightanswer) ansDiv.classList.add("results__answer--wrong");
        }

        questionDiv.appendChild(ansDiv);
      });

      if (finalAnswers[i] === undefined) {
        title.innerHTML += ' <span class="results__badge--skipped">No Answer</span>';
      } else if (finalAnswers[i] === q.rightanswer) {
        title.innerHTML += ' <span class="results__badge--right">Right Answer</span>';
        score++;
      } else {
        title.innerHTML += ' <span class="results__badge--wrong">Wrong Answer</span>';
      }

      container.appendChild(questionDiv);
    });

    scoreBox.textContent = `Score: ${score} / ${subjectData.length}`;
  });
