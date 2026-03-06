const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const namePattern = /^[a-zA-Z]+$/;

function validateRegister(firstName, lastName, email, password, rePassword) {
  if (!emailPattern.test(email)) {
    showCustomAlert("Invalid Email", "You must enter a valid email address.");
    return false;
  }
  if (!namePattern.test(firstName)) {
    showCustomAlert("Invalid Name", "First name must contain only letters.");
    return false;
  }
  if (!namePattern.test(lastName)) {
    showCustomAlert("Invalid Name", "Last name must contain only letters.");
    return false;
  }
  if (!password || !rePassword) {
    showCustomAlert("Empty Fields", "Password fields cannot be empty.");
    return false;
  }
  if (password !== rePassword) {
    showCustomAlert("Mismatch", "Passwords do not match!");
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
  showCustomAlert("Success", "Account registered successfully!", false, () => {
    window.location.href = "Login.html";
  });
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
