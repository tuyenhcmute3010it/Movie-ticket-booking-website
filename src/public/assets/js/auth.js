document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    // Lấy các giá trị nhập vào
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const termsChecked = document.getElementById("terms").checked;

    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(email)) {
      alert("Email is not in the correct format");
      isValid = false;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      isValid = false;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      isValid = false;
    }
    if (!termsChecked) {
      alert("You must agree to the terms and conditions");
      isValid = false;
    }
    if (isValid) {
      this.submit();
    }
  });
document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;
    this.textContent = type === "password" ? "Show" : "Hide";
  });

document
  .getElementById("toggleConfirmPassword")
  .addEventListener("click", function () {
    const confirmPasswordField = document.getElementById("confirmPassword");
    const type = confirmPasswordField.type === "password" ? "text" : "password";
    confirmPasswordField.type = type;
    this.textContent = type === "password" ? "Show" : "Hide";
  });
//////////////
