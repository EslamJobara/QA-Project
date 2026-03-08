const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const currentUser = localStorage.getItem("currentUser");
(function () {
  if (currentUser) {
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
    return;
  }
})();

function validateLogin(email) {
  if (!emailPattern.test(email)) {
    showCustomAlert("Invalid Email", "You must enter a valid email address.");
    return false;
  } else {
    return true;
  }
}

function onLogin() {
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;

  if (validateLogin(email)) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find((user) => {
      return user.email === email && user.password === password;
    });
    console.log(user);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      showCustomAlert("Welcome Back!", "Login successful.", false, () => {
        window.location.href = "../index.html";
      });
    } else {
      showCustomAlert("Login Failed", "Invalid email or password.");
    }
  }
}
