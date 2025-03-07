import { login, main, errorPage } from "./templates.js";
import { query } from "./queries.js";
import { drawSkillPies } from "./skillchart.js";
import { drawXPGraph } from "./proggress.js";
import { calculateAge, opt } from "./utils.js";
import { createXPBarGraph } from "./auditgraph.js";
import { updateAudits } from "./audits.js";
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
});

function displayLoginPage() {
  const loginTemplate = login();
  document.body.innerHTML = loginTemplate;

  document
    .getElementById("toggle-password")
    .addEventListener("click", function () {
      const passwordInput = document.getElementById("password");
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.textContent = "🙈"; // Change icon when password is visible
      } else {
        passwordInput.type = "password";
        this.textContent = "👁️"; // Change icon back to eye
      }
    });

  const loginForm = document.getElementById("login-btn");


  loginForm.addEventListener("click", async (e) => {
    e.preventDefault();
    loginsubmit()
  });

  document.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loginsubmit();
    }
  });
}

async function loginsubmit() {
  const errorMessage = document.getElementById("error-message");
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
}

async function displayMainPage() {
  const page = main();
  document.body.innerHTML = page;

  const logout = document.getElementById("logout-btn");
  logout.addEventListener("click", () => {
    localStorage.removeItem("jwt");
    window.location.reload();
  });

  let show = false;
  const auditsBtn = document.getElementById("audits-btn");
  const auditsDropdown = document.getElementById("audits-dropdown");

  auditsBtn.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevents the document click from firing immediately
    show = !show;

    if (show && auditsBtn.innerHTML !== "No audits") {
      auditsDropdown.style.display = "block";
    } else {
      auditsDropdown.style.display = "none";
    }
  });

  document.addEventListener("click", function (event) {
    // Check if the click is outside the dropdown and button
    if (!auditsDropdown.contains(event.target) && event.target !== auditsBtn) {
      auditsDropdown.style.display = "none";
      show = false; // Ensure state is updated
    }
  });

  try {
    const userData = await fetchUserData();
  } catch (error) {
    console.error("Error displaying main page:", error);
    document.body.innerHTML = errorPage();
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
  const xpTransactions = userData.data.transaction.filter(
    (tx) => tx.type === "xp"
  );
  const xpTransactionsreceived = userData.data.transaction.filter(
    (tx) => tx.type === "up"
  );
  const xpTransactionsgiven = userData.data.transaction.filter(
    (tx) => tx.type === "down"
  );
  const grades = userData.data.progress;
  const totalXP = xpTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const rec = xpTransactionsreceived.reduce((sum, tx) => sum + tx.amount, 0);
  const give = xpTransactionsgiven.reduce((sum, tx) => sum + tx.amount, 0);
  console.log(give / rec);
  const totalgrade = grades.reduce((sum, grade) => sum + grade.grade, 0);
  const auditRatio = userData.data.user[0].auditRatio;

  document.getElementById("username").innerText =
    userData.data.user[0].attrs.firstName + "🔽";
  document.getElementById("login").innerHTML = userData.data.user[0].login;
  document.getElementById("full-name").innerText =
    userData.data.user[0].attrs.firstName +
    " " +
    userData.data.user[0].attrs.lastName;
  document.getElementById("email").innerText =
    userData.data.user[0].attrs.email;
  document.getElementById("phone").innerText =
    userData.data.user[0].attrs.phone;
  document.getElementById("gender").innerText =
    userData.data.user[0].attrs.gender;
  document.getElementById("dob").innerText = calculateAge(
    userData.data.user[0].attrs.dateOfBirth
  );
  document.getElementById("xp").innerText = opt(totalXP);
  document.getElementById("grade").innerText = totalgrade.toFixed(2);
  document.getElementById("audits").innerText = auditRatio.toFixed(1);
  document.getElementById("level").innerText =
    userData.data.user[0].events[0].level;
  // Assuming `data` is the response from GraphQL
  const skills = userData.data.user[0].skills;
  const audits = userData.data.user[0].audits;
  const topSkills = getTopUniqueSkills(skills);
  updateAudits(audits);
  drawSkillPies(topSkills);
  drawXPGraph(xpTransactions);
  createXPBarGraph(give, rec);
}

function getTopUniqueSkills(skills) {
  const skillMap = new Map();

  skills.forEach((skill) => {
    if (!skillMap.has(skill.type)) {
      skillMap.set(skill.type, skill.amount);
    }
  });

  // Convert map back to array, sort by highest amount, and take top 5
  return [...skillMap.entries()]
    .map(([type, amount]) => ({ type, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);
}
