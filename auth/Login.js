const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

function validateLogin(email) {
  if (!emailPattern.test(email)) {
    console.log("You must enter a valid email");
    alert("You must enter a valid email");
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
      console.log("login success");
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      console.log("Login Failed");
    }
  }
}
