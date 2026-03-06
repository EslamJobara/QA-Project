let container = document.getElementById("answersContainer");
let scoreBox = document.getElementById("score");

let finalAnswers = JSON.parse(localStorage.getItem("finalAnswers")) || {};
let subject = "history";
let examData = {};

fetch("../questions.json")
  .then((res) => res.json())
  .then((data) => {
    examData = data[subject];

    let score = 0;

    examData.forEach((q, i) => {
      let questionDiv = document.createElement("div");
      questionDiv.className = "question";

      let title = document.createElement("h3");
      title.textContent = `Q${i + 1}: ${q.question}`;
      questionDiv.appendChild(title);

      q.answers.forEach((ans) => {
        let ansDiv = document.createElement("div");
        ansDiv.className = "answer";
        ansDiv.textContent = ans;

        if (ans === q.rightanswer) {
          ansDiv.classList.add("correct");
        }

        if (finalAnswers[i] === ans) {
          ansDiv.classList.add("user");

          if (ans !== q.rightanswer) {
            ansDiv.classList.add("wrong");
          }
        }

        questionDiv.appendChild(ansDiv);
      });
      if (finalAnswers[i] === undefined) {
        title.innerHTML = `Q${i + 1}: ${q.question} <span class="no-answer">No Answer</span>`;
      } else if (finalAnswers[i] === q.rightanswer) {
        title.innerHTML = `Q${i + 1}: ${q.question} <span class="right-answer">Right Answer</span>`;
        score++;
      } else {
        title.innerHTML = `Q${i + 1}: ${q.question} <span class="wrong-answer">Wrong Answer</span>`;
      }

      container.appendChild(questionDiv);
    });

    scoreBox.textContent = `Score : ${score} / ${examData.length}`;
  });
