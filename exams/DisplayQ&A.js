let questions = document.querySelector(".questions");
let currentIndex = 0;
let nextBtn = document.getElementById("nxt-btn");
let prevBtn = document.getElementById("Prev-btn");
let mrkBtn = document.getElementById("mrk-btn");
let submitBtn = document.getElementById("submit-btn");

let examData = {};
let numberOfQuestions = 0;

let currentSubject = localStorage.getItem("currentSubject");

let answers =
  JSON.parse(localStorage.getItem(`answersOf${currentSubject}`)) || {};
let markedQuestions =
  JSON.parse(localStorage.getItem(`markedOf${currentSubject}`)) || [];
let isExamFinished =
  localStorage.getItem(`isExamFinishedOf${currentSubject}`) === "true";

fetch("../questions.json")
  .then((data) => data.json())
  .then((data) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      const warning = document.getElementById("subjectWarning");
      warning.textContent = "You must be logged in to take an exam!";
      warning.style.display = "block";
      setTimeout(() => {
        window.location.href = "../auth/Login.html";
      }, 2000);
      return;
    }

    if (!localStorage.getItem("currentSubject")) {
      const warning = document.getElementById("subjectWarning");
      warning.style.display = "block";

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 2000);

      return;
    }
    examData = data;
    numberOfQuestions = examData[currentSubject].length;

    questionBoxes();
    showQuestion(currentIndex);
    updateActiveBox();
    updateButtons();
    BoxEvents();
    checkSubmit();
  });

function showQuestion(index) {
  questions.innerHTML = "";
  let currentQuestion = examData[currentSubject][index];

  let questionDiv = document.createElement("div");
  questionDiv.className = "questionHead";

  let title = document.createElement("h2");
  title.textContent = `Q${index + 1}: ${currentQuestion.question}?`;
  questionDiv.appendChild(title);

  currentQuestion.answers.forEach((ans) => {
    let answerDiv = document.createElement("div");
    answerDiv.className = "quiz__answer";

    answerDiv.innerHTML = `
<label>
  <input type="radio" name="q${index}" value="${ans}">
  ${ans}
</label>
`;

    let input = answerDiv.querySelector("input");

    if (answers[index] == ans) input.checked = true;

    if (isExamFinished) {
      input.disabled = true;
    }
    input.addEventListener("change", () => {
      answers[index] = ans;
      localStorage.setItem(
        `answersOf${currentSubject}`,
        JSON.stringify(answers),
      );

      markedQuestions = markedQuestions.filter((q) => q != index);
      localStorage.setItem(
        `markedOf${currentSubject}`,
        JSON.stringify(markedQuestions),
      );

      updateActiveBox();
      checkSubmit();
    });

    questionDiv.appendChild(answerDiv);
  });

  questions.appendChild(questionDiv);
}

function questionBoxes() {
  const qBoxesDiv = document.querySelector(".quiz__nav-boxes");
  qBoxesDiv.innerHTML = "";
  for (let i = 0; i < numberOfQuestions; i++) {
    let box = document.createElement("div");
    box.className = "quiz__nav-box";
    box.textContent = i + 1;
    qBoxesDiv.appendChild(box);
  }
}

function updateActiveBox() {
  let boxes = document.querySelectorAll(".quiz__nav-box");

  boxes.forEach((box, i) => {
    box.classList.remove("quiz__nav-box--active", "quiz__nav-box--answered", "quiz__nav-box--marked");

    if (answers[i]) {
      box.classList.add("quiz__nav-box--answered");
    }

    if (markedQuestions.includes(i)) {
      box.classList.add("quiz__nav-box--marked");
    }
  });
  boxes[currentIndex].classList.add("quiz__nav-box--active");
}

function BoxEvents() {
  const container = document.querySelector(".quiz__nav-boxes");

  container.addEventListener("click", (e) => {
    const box = e.target.closest(".quiz__nav-box");
    if (!box) return;

    const boxes = [...container.querySelectorAll(".quiz__nav-box")];
    currentIndex = boxes.indexOf(box);

    showQuestion(currentIndex);
    updateActiveBox();
    updateButtons();
  });
}

function updateButtons() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === numberOfQuestions - 1;
  if (isExamFinished) {
    mrkBtn.disabled = true;
  }
}
function checkSubmit() {
  const allAnswered = Object.keys(answers).length === numberOfQuestions;
  if (!isExamFinished) {
    submitBtn.disabled = !allAnswered;
  }
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion(currentIndex);
    updateActiveBox();
    updateButtons();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < numberOfQuestions - 1) {
    currentIndex++;
    showQuestion(currentIndex);
    updateActiveBox();
    updateButtons();
  }
});

mrkBtn.addEventListener("click", () => {
  if (isExamFinished) return;
  if (answers[currentIndex]) {
    delete answers[currentIndex];
    localStorage.setItem(`answersOf${currentSubject}`, JSON.stringify(answers));
  }
  if (markedQuestions.includes(currentIndex)) {
    markedQuestions = markedQuestions.filter((q) => q != currentIndex);
  } else {
    markedQuestions.push(currentIndex);
  }
  localStorage.setItem(
    `markedOf${currentSubject}`,
    JSON.stringify(markedQuestions),
  );

  showQuestion(currentIndex);
  updateActiveBox();
  checkSubmit();
});

function forceSubmit() {
  document
    .querySelectorAll("input[type=radio]")
    .forEach((input) => (input.disabled = true));
  localStorage.setItem(
    `finalAnswersOf${currentSubject}`,
    JSON.stringify(answers),
  );
  localStorage.setItem(`isExamFinishedOf${currentSubject}`, "true");
  localStorage.removeItem(`examEndTimeOf${currentSubject}`);
  window.location.href = "answers.html";
}

function submitExam() {
  showCustomAlert(
    "Are you sure?",
    "Do you want to submit your exam now?",
    true,
    () => {
      forceSubmit();
    },
  );
}

submitBtn.addEventListener("click", submitExam);
