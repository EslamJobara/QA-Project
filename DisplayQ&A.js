let questions = document.querySelector(".questions");
let currentIndex = 0;
let nextBtn = document.getElementById("nxt-btn");
let prevBtn = document.getElementById("Prev-btn");
let mrkBtn = document.getElementById("mrk-btn");
let submitBtn = document.getElementById("submit-btn");

let examData = {};
let subject = "history";

let answers = JSON.parse(localStorage.getItem("answers")) || {};
let markedQuestions = JSON.parse(localStorage.getItem("marked")) || [];
let examFinished = localStorage.getItem("examFinished") === "true";
let totalQuestions;

fetch("/questions.json")
  .then((data) => data.json())
  .then((data) => {
    examData = data;
    totalQuestions = examData[subject].length;

    questionBoxes();
    showQuestion(currentIndex);
    updateActiveBox();
    updateButtons();
    BoxEvents();
    checkSubmit();
  });

function showQuestion(index) {
  questions.innerHTML = "";
  let currentQuestion = examData[subject][index];

  let questionDiv = document.createElement("div");
  questionDiv.className = "questionHead";

  let title = document.createElement("h2");
  title.textContent = `Q.${index + 1} (${currentQuestion.question})?`;
  questionDiv.appendChild(title);

  currentQuestion.answers.forEach((ans) => {
    let answerDiv = document.createElement("div");
    answerDiv.className = "answer";

    answerDiv.innerHTML = answerDiv.innerHTML = `
<label>
  <input type="radio" name="q${index}" value="${ans}">
  ${ans}
</label>
`;

    let input = answerDiv.querySelector("input");

    if (answers[index] == ans) input.checked = true;

    if (examFinished) {
      input.disabled = true;
    }
    input.addEventListener("change", () => {
      answers[index] = ans;
      localStorage.setItem("answers", JSON.stringify(answers));

      markedQuestions = markedQuestions.filter((q) => q != index);
      localStorage.setItem("marked", JSON.stringify(markedQuestions));

      updateActiveBox();
      checkSubmit();
    });

    questionDiv.appendChild(answerDiv);
  });

  questions.appendChild(questionDiv);
}

function questionBoxes() {
  const qBoxesDiv = document.querySelector(".question-boxes");
  qBoxesDiv.innerHTML = "";
  for (let i = 0; i < totalQuestions; i++) {
    let box = document.createElement("div");
    box.className = "q-box";
    box.textContent = i + 1;
    qBoxesDiv.appendChild(box);
  }
}

function updateActiveBox() {
  let boxes = document.querySelectorAll(".q-box");

  boxes.forEach((box, i) => {
    box.classList.remove("active", "answered", "marked");

    if (answers[i]) {
      box.classList.add("answered");
    }

    if (markedQuestions.includes(i)) {
      box.classList.add("marked");
    }
  });
  boxes[currentIndex].classList.add("active");
}

function BoxEvents() {
  const container = document.querySelector(".question-boxes");

  container.addEventListener("click", (e) => {
    const box = e.target.closest(".q-box");
    if (!box) return;

    const boxes = [...container.querySelectorAll(".q-box")];
    currentIndex = boxes.indexOf(box);

    showQuestion(currentIndex);
    updateActiveBox();
    updateButtons();
  });
}

function updateButtons() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === totalQuestions - 1;
  if (examFinished) {
    mrkBtn.disabled = true;
  }
}
function checkSubmit() {
  const allAnswered = Object.keys(answers).length === totalQuestions;
  if (!examFinished) {
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
  if (currentIndex < totalQuestions - 1) {
    currentIndex++;
    showQuestion(currentIndex);
    updateActiveBox();
    updateButtons();
  }
});

mrkBtn.addEventListener("click", () => {
  if (examFinished) return;
  if (answers[currentIndex]) {
    delete answers[currentIndex];
    localStorage.setItem("answers", JSON.stringify(answers));
  }
  if (markedQuestions.includes(currentIndex)) {
    markedQuestions = markedQuestions.filter((q) => q != currentIndex);
  } else {
    markedQuestions.push(currentIndex);
  }
  localStorage.setItem("marked", JSON.stringify(markedQuestions));

  updateActiveBox();
  checkSubmit();
});

function submitExam() {
  document
    .querySelectorAll("input[type=radio]")
    .forEach((input) => (input.disabled = true));
  localStorage.setItem("finalAnswers", JSON.stringify(answers));
  localStorage.setItem("examFinished", "true");
  localStorage.removeItem("examEndTime");
  window.location.href = "answers.html";
}

submitBtn.addEventListener("click", submitExam);

const timerCanvas = document.createElement("canvas");
timerCanvas.id = "timerCanvas";
timerCanvas.width = 150;
timerCanvas.height = 150;
timerCanvas.style.position = "fixed";
timerCanvas.style.top = "25px";
timerCanvas.style.left = "25px";
timerCanvas.style.zIndex = "10";
document.body.appendChild(timerCanvas);

const ctx = timerCanvas.getContext("2d");

let examDuration = 2 * 60 * 1000;
let endTime = localStorage.getItem("examEndTime");

if (!endTime) {
  endTime = Date.now() + examDuration;
  localStorage.setItem("examEndTime", endTime);
}

function drawCircularTimer() {
  let remaining = endTime - Date.now();

  if (remaining <= 0) {
    remaining = 0;
    examFinished = true;
    clearInterval(countdown);
    submitExam();
  }

  const totalSeconds = examDuration / 1000;
  const remainingSeconds = remaining / 1000;

  const centerX = timerCanvas.width / 2;
  const centerY = timerCanvas.height / 2;

  let radius = 45;

  ctx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fill();

  const startAngle = -Math.PI / 2;
  const endAngle =
    startAngle +
    2 * Math.PI * ((totalSeconds - remainingSeconds) / totalSeconds);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);

  let color = "#00ff00";
  let text_color = "rgb(56, 202, 210)";
  if (remainingSeconds <= 60) {
    color = "#ffaa00";
    text_color = "#ffaa00";
  }

  if (remainingSeconds <= 30) {
    color = "#ff3b3b";
    text_color = "#ff3b3b";
  }
  ctx.fillStyle = text_color;

  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.stroke();

  const minutes = Math.floor(remainingSeconds / 60);
  let seconds = Math.floor(remainingSeconds % 60);
  seconds = seconds < 10 ? "0" + seconds : seconds;
  let fontSize = 18;

  if (remainingSeconds <= 30) {
    fontSize = 18 + Math.sin(Date.now() / 280) * 6;
  }
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${minutes}:${seconds}`, centerX, centerY);

  if (examFinished) {
    timerCanvas.style.display = "none";
  }
}

countdown = setInterval(drawCircularTimer, 1000);
