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
let endTime = localStorage.getItem(`examEndTimeOf${currentSubject}`);

if (!endTime) {
  endTime = Date.now() + examDuration;
  localStorage.setItem(`examEndTimeOf${currentSubject}`, endTime);
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
    color = "#efac01";
    text_color = "#efac01";
  }

  if (remainingSeconds <= 30) {
    color = "#ff0000";
    text_color = "#ff0000";
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
