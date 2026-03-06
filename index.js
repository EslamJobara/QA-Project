const subjectLinks = document.querySelectorAll(".nav-links a");

// لو الرابط فيه مادة (مثلاً exams/history.html)
subjectLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href"); // مثال: "exams/history.html"

    // نجيب اسم المادة من اسم الملف
    const subject = href.split("/").pop().split(".")[0]; // "history"

    // نخزنها في localStorage
    localStorage.setItem("currentSubject", subject);
  });
});
