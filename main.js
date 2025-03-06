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

  let show = false;
  document.getElementById("audits-btn").addEventListener("click", function () {
    show = !show;
    if (
      show &&
      document.getElementById("audits-btn").innerHTML !== "No audits"
    ) {
      document.getElementById("audits-dropdown").style.display = "block";
    } else {
      document.getElementById("audits-dropdown").style.display = "none";
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
  // Assuming `data` is the response from GraphQL
  const skills = userData.data.user[0].skills;
  const audits = userData.data.user[0].audits;
  const topSkills = getTop5UniqueSkills(skills);
  updateAudits(audits);
  drawSkillPies(topSkills);
  drawXPGraph(xpTransactions);
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

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--; // Adjust if the birthday hasn't occurred yet this year
  }

  return age;
}

function getDay(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short", // e.g., Mon
    month: "short", // e.g., Jan
    day: "2-digit", // e.g., 01
    year: "numeric", // e.g., 2024
  });
}

function drawSkillPies(skills) {
  const container = document.getElementById("skills-container");
  container.innerHTML = ""; // Clear previous charts

  skills.forEach((skill) => {
    // Create skill chart container
    const skillDiv = document.createElement("div");
    skillDiv.classList.add("skill-chart");

    // Create SVG for the pie chart
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");

    // Create background circle
    const bgCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    bgCircle.setAttribute("cx", "50");
    bgCircle.setAttribute("cy", "50");
    bgCircle.setAttribute("r", "45");
    bgCircle.setAttribute("fill", "#333");

    svg.appendChild(bgCircle);

    if (skill.amount === 100) {
      // Full circle for 100% skill
      const fullCircle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      fullCircle.setAttribute("cx", "50");
      fullCircle.setAttribute("cy", "50");
      fullCircle.setAttribute("r", "45");
      fullCircle.setAttribute("fill", "#6366f1"); // Full green color

      svg.appendChild(fullCircle);
    } else if (skill.amount > 0) {
      // Convert percentage to angle (360° max)
      const angle = (skill.amount / 100) * 360;
      const radians = (angle - 90) * (Math.PI / 180);
      const x = 50 + 45 * Math.cos(radians);
      const y = 50 + 45 * Math.sin(radians);
      const largeArcFlag = angle > 180 ? 1 : 0;

      // Create pie path
      const pathData = `
        M 50,50 
        L 50,5 
        A 45,45 0 ${largeArcFlag},1 ${x},${y} 
        Z
      `;

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", pathData);
      path.setAttribute("fill", "#6366f1");

      svg.appendChild(path);
    }

    // Create label
    const label = document.createElement("div");
    label.classList.add("skill-label");
    label.textContent = `${skill.type} (${skill.amount}%)`;

    // Append to container
    skillDiv.appendChild(svg);
    skillDiv.appendChild(label);
    container.appendChild(skillDiv);
  });
}

function getTop5UniqueSkills(skills) {
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
    .slice(0, 5);
}

// Function to update audits dynamically
function updateAudits(audits) {
  const auditsBtn = document.getElementById("audits-btn");
  const auditsDropdown = document.getElementById("audits-dropdown");

  auditsDropdown.innerHTML = ""; // Clear previous audits

  if (audits.length === 0) {
    auditsBtn.textContent = "No audits";
    auditsDropdown.style.display = "none";
    return;
  }

  auditsBtn.textContent = `Audits (${audits.length})`;

  audits.forEach((audit) => {
    const projectname = audit.group.path.split("/").pop();
    let members = "";
    for (let user of audit.group.members) {
      members += " " + user.userLogin;
    }
    const auditDiv = document.createElement("div");
    auditDiv.classList.add("audit-item");
    auditDiv.innerHTML = `
          <p><strong>Project:</strong> ${projectname}</p>
          <p><strong>Group Admin:</strong> ${audit.group.captainLogin}</p>
          <p><strong>Members:</strong> ${members}</p>
          <p><strong>Audit Code:</strong> ${audit.private.code}</p>
      `;
    auditsDropdown.appendChild(auditDiv);
  });
}
function drawXPGraph(xpData) {
  const container = document.getElementById("xp-graph");
  container.innerHTML = ""; // Clear previous graph

  if (xpData.length === 0) return;

  // Sort XP data by date (ascending order)
  xpData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Convert XP to cumulative XP over time
  let cumulativeXP = 0;
  const points = xpData.map((entry) => {
    cumulativeXP += entry.amount;
    return { date: new Date(entry.createdAt), xp: cumulativeXP };
  });

  // SVG settings
  const width = container.clientWidth  // Adjust to available width
  const height = 500; // Increased height for better visibility
  const padding = 60;

  // Get min/max values
  const minXP = 0;
  const maxXP = Math.max(...points.map((p) => p.xp));
  const minDate = points[0].date;
  const maxDate = points[points.length - 1].date;

  // Scale functions
  const xScale = (date) =>
    padding + ((date - minDate) / (maxDate - minDate)) * (width - 2 * padding);
  const yScale = (xp) =>
    height -
    padding -
    ((xp - minXP) / (maxXP - minXP)) * (height - 2 * padding);
  console.log(width, height);
  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.style.background = "#1e293b"; // Dark background for visibility

  // Draw axes
  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  xAxis.setAttribute("x1", padding);
  xAxis.setAttribute("y1", height - padding);
  xAxis.setAttribute("x2", width - padding);
  xAxis.setAttribute("y2", height - padding);
  xAxis.setAttribute("stroke", "#6366f1");
  xAxis.setAttribute("stroke-width", "2");

  const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  yAxis.setAttribute("x1", padding);
  yAxis.setAttribute("y1", height - padding);
  yAxis.setAttribute("x2", padding);
  yAxis.setAttribute("y2", padding);
  yAxis.setAttribute("stroke", "#6366f1")
  yAxis.setAttribute("stroke-width", "2");

  svg.appendChild(xAxis);
  svg.appendChild(yAxis);

  // Draw XP progression line
  let pathData = `M ${xScale(points[0].date)},${yScale(points[0].xp)}`;
  points.forEach((point) => {
    pathData += ` L ${xScale(point.date)},${yScale(point.xp)}`;
  });

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#6366f1");
  path.setAttribute("stroke-width", "3");

  svg.appendChild(path);

  // Tooltip for XP values
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.style.position = "absolute";
  tooltip.style.background = "black";
  tooltip.style.color = "white";
  tooltip.style.padding = "5px 10px";
  tooltip.style.borderRadius = "5px";
  tooltip.style.fontSize = "14px";
  tooltip.style.display = "none";
  tooltip.style.pointerEvents = "none";
  tooltip.style.transform = "translate(-50%, -30px)";
  container.appendChild(tooltip);

  // Append circles for each point
  points.forEach((point) => {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", xScale(point.date));
    circle.setAttribute("cy", yScale(point.xp));
    circle.setAttribute("r", "6");
    circle.setAttribute("fill", "#fff");
    circle.style.cursor = "pointer";

    // Tooltip event listeners
    circle.addEventListener("mouseover", (event) => {
      tooltip.style.display = "block";
      tooltip.textContent = `XP: ${opt(point.xp)} on ${getDay(point.date)}`;
    });

    circle.addEventListener("mousemove", (event) => {
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
    });

    circle.addEventListener("mouseout", () => {
      tooltip.style.display = "none";
    });

    svg.appendChild(circle);
  });

  // Append the graph to the container
  container.appendChild(svg);
}
