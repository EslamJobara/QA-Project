function register() {
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  let rePassword = document.querySelector("#rePassword").value;
  let fName = document.querySelector("#fName").value;
  let lName = document.querySelector("#lName").value;

  console.log(email, password, rePassword, fName, lName);
  let newUser = {
    name: fName + " " + lName,
    email: email,
    password: password,
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Register completed");
}
