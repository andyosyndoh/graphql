import { login,main } from "./templates.js";
document.addEventListener("DOMContentLoaded", function () {
  //check localstorage for JWT tokens
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    // display main page
    displayMainPage();
  } else {
    // display login page
    displayLoginPage();
  }

  // login button click event
});

function displayLoginPage() {
  const loginTemplate = login();
  document.body.innerHTML = loginTemplate;

  const loginForm = document.getElementById("login-btn");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("click", async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";

    const usernameOrEmail = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const credentials = btoa(`${usernameOrEmail}:${password}`);

    try {
      const response = await fetch(
        "https://learn.zone01kisumu.ke/api/auth/signin",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials. Please try again.");
      }

      const data = await response.json();
      localStorage.setItem("jwt", data);
      displayMainPage()
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
}

function displayMainPage() {
    const page = main()
    document.body.innerHTML = page;

    const logout = document.getElementById("logout-btn")
    logout.addEventListener("click", () => {
        localStorage.removeItem("jwt")
        window.location.reload();
    })
}