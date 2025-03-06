import { login, main } from "./templates.js";
import { query } from "./queries.js";
let Userdata;
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
      displayMainPage();
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
}

async function displayMainPage() {
  const page = main();
  document.body.innerHTML = page;

  const logout = document.getElementById("logout-btn");
  logout.addEventListener("click", () => {
    localStorage.removeItem("jwt");
    window.location.reload();
  });
  let clicked = false;
  document.getElementById("username").addEventListener("click", function () {
    clicked =!clicked;
    if (clicked) {
      document.getElementById("user-details").style.display = "block";
    } else {
      document.getElementById("user-details").style.display = "none";
    }
  });

  try {
    const userData = await fetchUserData();
  } catch (error) {
    console.error("Error displaying main page:", error);
  }
}

async function fetchUserData() {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    throw new Error("No JWT token found");
  }

  try {
    const response = await fetch(
      "https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const result = await response.json();
    console.log("GraphQL Response:", result);

    if (result.data && result.data.user.length > 0) {
      updateUI(result); // Pass the first user object
    } else {
      console.error("No user data found");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

function updateUI(userData) {
  const xpTransactions = userData.data.transaction;
  const grades = userData.data.progress;
  const totalXP = xpTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalgrade = grades.reduce((sum, grade) => sum + grade.grade, 0);
  const auditRatio = userData.data.user[0].auditRatio;


  document.getElementById("username").innerText =
    userData.data.user[0].attrs.firstName;
  document.getElementById("full-name").innerText = userData.data.user[0].attrs.firstName + " " + userData.data.user[0].attrs.lastName;
  document.getElementById("email").innerText = userData.data.user[0].attrs.email;
  document.getElementById("phone").innerText = userData.data.user[0].attrs.phone;
  document.getElementById("gender").innerText = userData.data.user[0].attrs.gender;
  document.getElementById("dob").innerText = calculateAge(userData.data.user[0].attrs.dateOfBirth);
  document.getElementById("xp").innerText = opt(totalXP);
  document.getElementById("grade").innerText = totalgrade.toFixed(2);
  document.getElementById("audits").innerText = auditRatio.toFixed(1);
}

function opt(xp) {
  if (xp < 1000) {
    return xp + " Bytes";
  }
  let mbs = xp / 1000;
  if (mbs < 1000) {
    return mbs.toFixed(2) + " KBs";
  }
  let gbs = mbs / 1000;
  if (gbs < 1000) {
    return gbs.toFixed(2) + " MBs";
  }
  let tbs = gbs / 1000;
  return tbs.toFixed(2) + " GBs";
}

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Adjust if the birthday hasn't occurred yet this year
  }
  
  return age;
}