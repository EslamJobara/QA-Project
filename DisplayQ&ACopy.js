let questions = document.getElementsByClassName("questions")[0];
let currentIndex = 0;
let nextBtn = document.getElementById("nxt-btn");
let prevBtn = document.getElementById("Prev-btn");

let examData = {};

fetch("/questions.json")
  .then((data) => {
    //   console.log(data);
   return data.json();
  })
  .then((data) => {
      console.log(data);
    examData = data;
  });
console.log(examData);

// function showQuestion(index) {
//   questions.innerHTML = "";
//   let currentQuestion = examData.math[index];
//   let questionDiv = document.createElement("div");
//   questionDiv.className = "questionHead";

//   let title = document.createElement("h2");
//   title.textContent =
//     "Q." + (index + 1) + "  (" + currentQuestion.question + ") is ?";
//   questionDiv.appendChild(title);

//   currentQuestion.answers.forEach((ans, i) => {
//     let answerDiv = document.createElement("div");
//     answerDiv.className = "answer";
//     answerDiv.innerHTML = `
//       <input type="radio" name="q${index}" value="${ans}" />
//       ${ans}
//     `;

//     questionDiv.appendChild(answerDiv);
//   });

//   questions.appendChild(questionDiv);
//   let qBoxesDiv = document.createElement("div");

//   qBoxesDiv.className = "question-boxes";
//   for (let i = 0; i < examData.math.length; i++) {
//     qBoxesDiv.innerHTML += `<div class="q-box">${i + 1}</div>`;
//   }
//   questions.appendChild(qBoxesDiv);
// }

// showQuestion(currentIndex);
// updateActiveBox();
// function updateActiveBox() {
//   let qbox = document.querySelectorAll(".q-box");

//   qbox.forEach((box) => box.classList.remove("active"));
//   qbox[currentIndex].classList.add("active");
// }

// function BoxEvents() {
//   let qBox = document.querySelectorAll(".q-box");

//   qBox.forEach((box, index) => {
//     box.addEventListener("click", () => {
//       currentIndex = index;
//       showQuestion(currentIndex);
//       BoxEvents();
//       updateButtons();
//       updateActiveBox();
//     });
//   });
// }
// BoxEvents();
// function updateButtons() {
//   prevBtn.disabled = currentIndex === 0;
//   nextBtn.disabled = currentIndex === examData.math.length - 1;
// }

// nextBtn.addEventListener("click", () => {
//   if (currentIndex < examData.math.length - 1) {
//     currentIndex++;
//     showQuestion(currentIndex);
//     BoxEvents();
//     updateButtons();
//     updateActiveBox();
//   } else {
//     questions.innerHTML = `
//       <div style="border:1px dashed">
//         <h2>Quiz Finished</h2>
//       </div>
//     `;
//   }
// });

// prevBtn.addEventListener("click", () => {
//   if (currentIndex > 0) {
//     currentIndex--;
//     showQuestion(currentIndex);
//     BoxEvents();
//     updateButtons();
//     updateActiveBox();
//   }
// });
