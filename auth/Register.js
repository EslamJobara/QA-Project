const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const namePattern = /^[a-zA-Z]+$/;

function validateRegister(firstName, lastName, email, password, rePassword) {
  if (!emailPattern.test(email)) {
    console.log(!emailPattern.test(email));
    console.log("You must enter a valid email");
    return false;
  }
  if (!namePattern.test(firstName)) {
    console.log("You must enter a valid name");
    return false;
  }
  if (!namePattern.test(lastName)) {
    console.log("You must enter a valid name");
    return false;
  }
  if (password || rePassword == false) {
    console.log("You must enter a valid password");
    return false;
  }
  if (password !== rePassword) {
    console.log("You must enter the same password");
    return false;
  }
  return true;
}

function createUser(firstName, lastName, email, password) {
  let newUser = {
    name: firstName + " " + lastName,
    email: email,
    password: password,
  };
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Register completed");
}

function onRegister() {
  let email = document.querySelector("#email").value;
  console.log(email);
  let password = document.querySelector("#password").value;
  let rePassword = document.querySelector("#rePassword").value;
  let fName = document.querySelector("#fName").value;
  let lName = document.querySelector("#lName").value;

  if (validateRegister(fName, lName, email, password, rePassword)) {
    createUser(fName, lName, email, password);
  }
}
