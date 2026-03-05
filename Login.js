function login() {
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find((user) => {
    console.log(user.email);
      console.log(email);
      console.log(password);
      console.log(user.password);
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
