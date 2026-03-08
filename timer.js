const timerCanvas = document.createElement("canvas");
timerCanvas.id = "timerCanvas";
timerCanvas.width = 150;
timerCanvas.height = 150;
timerCanvas.style.position = "fixed";
timerCanvas.style.top = "35px";
timerCanvas.style.left = "auto";
timerCanvas.style.right = "35px";
timerCanvas.style.zIndex = "10";
timerCanvas.style.borderRadius = "50%";
timerCanvas.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
document.body.appendChild(timerCanvas);

const ctx = timerCanvas.getContext("2d");
const examDuration = 2 * 60 * 1000;
let endTime = localStorage.getItem(`examEndTimeOf${currentSubject}`);

if (!endTime) {
  endTime = Date.now() + examDuration;
  localStorage.setItem(`examEndTimeOf${currentSubject}`, endTime);
}

function drawCircularTimer() {
  let remaining = endTime - Date.now();

  if (remaining <= 0) {
    remaining = 0;
    clearInterval(countdown);
    showCustomAlert("Time is up!", "Your exam has been automatically submitted.", false, forceSubmit);
    return;
  }

  const remainingSeconds = remaining / 1000;
  const centerX = timerCanvas.width / 2;
  const centerY = timerCanvas.height / 2;
  const radius = 55;

  ctx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fill();

  const startAngle = -Math.PI / 2;
  const progress = (examDuration / 1000 - remainingSeconds) / (examDuration / 1000);
  const endAngle = startAngle + 2 * Math.PI * progress;

  let color = "#00ff00";
  let textColor = "rgb(56, 202, 210)";
  let glowIntensity = 0;

  if (remainingSeconds <= 60) {
    color = "#efac01";
    textColor = "#efac01";
    glowIntensity = 15;
  }

  if (remainingSeconds <= 30) {
    color = "#ff0000";
    textColor = "#ff0000";
    const pulse = Math.abs(Math.sin(Date.now() / 200));
    glowIntensity = 20 + pulse * 30;
    
    const scale = 1 + pulse * 0.1;
    timerCanvas.style.transform = `scale(${scale})`;
    timerCanvas.style.boxShadow = `0 0 ${glowIntensity}px ${glowIntensity / 2}px rgba(255, 0, 0, ${0.7 + pulse * 0.3})`;
  } else if (remainingSeconds <= 60) {
    timerCanvas.style.transform = "scale(1)";
    timerCanvas.style.boxShadow = `0 0 ${glowIntensity}px ${glowIntensity / 3}px rgba(239, 172, 1, 0.6)`;
  } else {
    timerCanvas.style.transform = "scale(1)";
    timerCanvas.style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.3)";
  }

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  
  if (remainingSeconds <= 30) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
  }
  
  ctx.stroke();
  ctx.shadowBlur = 0;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60).toString().padStart(2, "0");
  
  let fontSize = 24;
  if (remainingSeconds <= 30) {
    const pulse = Math.abs(Math.sin(Date.now() / 200));
    fontSize = 24 + pulse * 10;
  }

  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  if (remainingSeconds <= 30) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = textColor;
  }
  
  ctx.fillText(`${minutes}:${seconds}`, centerX, centerY);
  ctx.shadowBlur = 0;

  if (isExamFinished) {
    timerCanvas.style.display = "none";
  }
}

const countdown = setInterval(drawCircularTimer, 50);
