let canvas = document.getElementById("space");
let satrCtx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3,
    vy: Math.random() * 0.5 + 0.2,
    opacity: Math.random(),
    delta: Math.random() * 0.02 + 0.01,
  });
}
function drawStars() {
  satrCtx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((s) => {
    satrCtx.beginPath();
    satrCtx.fillStyle = `rgba(255,255,255,${s.opacity})`;
    satrCtx.arc(s.x, s.y, s.r, 1, Math.PI * 2);
    satrCtx.fill();
    s.y += s.vy;
    s.x -= s.vy;
    if (s.y >= canvas.height) s.y = 0;
    if (s.x < 0) s.x = canvas.width;
    s.opacity += s.delta;
    if (s.opacity > 1 || s.opacity < 0) s.delta = -s.delta;
  });
}

setInterval(drawStars, 50);
