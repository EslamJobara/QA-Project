let container = document.getElementById("answersContainer");
let scoreBox = document.getElementById("score");

let currentSubject = localStorage.getItem("currentSubject") || "history";
const finalAnswers =
  JSON.parse(localStorage.getItem(`finalAnswersOf${currentSubject}`)) || {};
let subject = "history";
let examData = {};

fetch("../questions.json")
  .then((res) => res.json())
  .then((data) => {
    const subjectData = data[currentSubject];
    let score = 0;

    subjectData.forEach((q, i) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "question";

      const title = document.createElement("h3");
      title.textContent = `Q${i + 1}: ${q.question}`;
      questionDiv.appendChild(title);

      q.answers.forEach((ans) => {
        const ansDiv = document.createElement("div");
        ansDiv.className = "answer";
        ansDiv.textContent = ans;

        if (ans === q.rightanswer) ansDiv.classList.add("correct");
        if (finalAnswers[i] === ans) {
          ansDiv.classList.add("user");
          if (ans !== q.rightanswer) ansDiv.classList.add("wrong");
        }

        questionDiv.appendChild(ansDiv);
      });

      if (finalAnswers[i] === undefined) {
        title.innerHTML += ' <span class="no-answer">No Answer</span>';
      } else if (finalAnswers[i] === q.rightanswer) {
        title.innerHTML += ' <span class="right-answer">Right Answer</span>';
        score++;
      } else {
        title.innerHTML += ' <span class="wrong-answer">Wrong Answer</span>';
      }

      container.appendChild(questionDiv);
    });

    scoreBox.textContent = `Score: ${score} / ${subjectData.length}`;
  });
