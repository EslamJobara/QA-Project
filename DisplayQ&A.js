let examdata = {
  math: [
    { question: "2*2", answers: [1, 2, 3, 4], rightanswer: 4 },
    { question: "5+3", answers: [7, 8, 9, 10], rightanswer: 8 },
    { question: "10-4", answers: [6, 5, 7, 8], rightanswer: 6 },
    { question: "6/2", answers: [2, 3, 4, 6], rightanswer: 3 },
    { question: "3*7", answers: [20, 21, 19, 18], rightanswer: 21 },
    { question: "9+6", answers: [14, 15, 16, 17], rightanswer: 15 },
    { question: "12-5", answers: [5, 6, 7, 8], rightanswer: 7 },
    { question: "8/4", answers: [1, 2, 3, 4], rightanswer: 2 },
  ],
  history: [
    {
      question: "Who discovered America?",
      answers: ["Columbus", "Magellan", "Vespucci", "Cook"],
      rightanswer: "Columbus",
    },
    {
      question: "When did World War II end?",
      answers: [1942, 1945, 1948, 1950],
      rightanswer: 1945,
    },
    {
      question: "Who was the first President of USA?",
      answers: ["Lincoln", "Washington", "Jefferson", "Adams"],
      rightanswer: "Washington",
    },
    {
      question: "The Great Wall is in which country?",
      answers: ["China", "India", "Japan", "Korea"],
      rightanswer: "China",
    },
    {
      question: "Fall of Roman Empire happened in?",
      answers: [410, 476, 500, 395],
      rightanswer: 476,
    },
    {
      question: "Who wrote the Magna Carta?",
      answers: ["King John", "Henry VIII", "Richard III", "Edward I"],
      rightanswer: "King John",
    },
    {
      question: "French Revolution began in?",
      answers: [1789, 1776, 1804, 1799],
      rightanswer: 1789,
    },
    {
      question: "Who was Cleopatra?",
      answers: [
        "Egyptian Queen",
        "Roman Empress",
        "Greek Philosopher",
        "Persian Princess",
      ],
      rightanswer: "Egyptian Queen",
    },
  ],
  art: [
    {
      question: "Who painted the Mona Lisa?",
      answers: ["Da Vinci", "Michelangelo", "Raphael", "Picasso"],
      rightanswer: "Da Vinci",
    },
    {
      question: "Starry Night is by?",
      answers: ["Van Gogh", "Monet", "Rembrandt", "Dali"],
      rightanswer: "Van Gogh",
    },
    {
      question: "The sculpture 'David' is by?",
      answers: ["Michelangelo", "Donatello", "Bernini", "Rodin"],
      rightanswer: "Michelangelo",
    },
    {
      question: "Impression, Sunrise was painted by?",
      answers: ["Monet", "Manet", "Cézanne", "Degas"],
      rightanswer: "Monet",
    },
    {
      question: "Guernica is painted by?",
      answers: ["Picasso", "Dali", "Klimt", "Matisse"],
      rightanswer: "Picasso",
    },
    {
      question: "The Persistence of Memory is by?",
      answers: ["Dali", "Picasso", "Van Gogh", "Warhol"],
      rightanswer: "Dali",
    },
    {
      question: "Water Lilies series belongs to?",
      answers: ["Monet", "Renoir", "Degas", "Cézanne"],
      rightanswer: "Monet",
    },
    {
      question: "The Last Supper was painted in?",
      answers: [1490, 1495, 1500, 1505],
      rightanswer: 1495,
    },
  ],
};

let questions = document.getElementsByClassName("questions")[0];
let currentIndex = 0;
let nextBtn = document.getElementById("nxt-btn");
let prevBtn = document.getElementById("Prev-btn");

function showQuestion(index) {
  questions.innerHTML = "";
  let currentQuestion = examdata.math[index];
  let questionDiv = document.createElement("div");
  questionDiv.className = "questionHead";

  let title = document.createElement("h2");
  title.textContent =
    "Q." + (index + 1) + "  (" + currentQuestion.question + ") is ?";
  questionDiv.appendChild(title);

  currentQuestion.answers.forEach((ans, i) => {
    let answerDiv = document.createElement("div");
    answerDiv.className = "answer";
    answerDiv.innerHTML = `
      <input type="radio" name="q${index}" value="${ans}" />
      ${ans}
    `;

    questionDiv.appendChild(answerDiv);
  });

  questions.appendChild(questionDiv);
  let qBoxesDiv = document.createElement("div");

  qBoxesDiv.className = "question-boxes";
  for (let i = 0; i < examdata.math.length; i++) {
    qBoxesDiv.innerHTML += `<div class="q-box">${i + 1}</div>`;
  }
  questions.appendChild(qBoxesDiv);
}

showQuestion(currentIndex);
updateActiveBox();
function updateActiveBox() {
  let qbox = document.querySelectorAll(".q-box");

  qbox.forEach((box) => box.classList.remove("active"));
  qbox[currentIndex].classList.add("active");
}

function BoxEvents() {
  let qBox = document.querySelectorAll(".q-box");

  qBox.forEach((box, index) => {
    box.addEventListener("click", () => {
      currentIndex = index;
      showQuestion(currentIndex);
      BoxEvents();
      updateButtons();
      updateActiveBox();
    });
  });
}
BoxEvents();
function updateButtons() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === examdata.math.length - 1;
}

nextBtn.addEventListener("click", () => {
  if (currentIndex < examdata.math.length - 1) {
    currentIndex++;
    showQuestion(currentIndex);
    BoxEvents();
    updateButtons();
    updateActiveBox();
  } else {
    questions.innerHTML = `
      <div style="border:1px dashed">
        <h2>Quiz Finished</h2>
      </div>
    `;
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion(currentIndex);
    BoxEvents();
    updateButtons();
    updateActiveBox();
  }
});
