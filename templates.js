export const login = () => `
  <div class="login-container">
        <h2>Login</h2>
        <input type="text" id="username" class="input-field" placeholder="Username or Email">
        <input type="password" id="password" class="input-field" placeholder="Password">
        <button class="login-btn" id="login-btn">Login</button>
        <p class="error-message" id="error-message"></p>
    </div>
`

export const main = () => `
    <div class="container">
    <div class="header">
        <h2>
            Welcome, <span id="username" class="dropdown-toggle">Loading...</span>
            <div class="dropdown-content" id="user-details">
                <p><strong>Full Name:</strong> <span id="full-name">-</span></p>
                <p><strong>Email:</strong> <span id="email">-</span></p>
                <p><strong>Phone:</strong> <span id="phone">-</span></p>
                <p><strong>Gender:</strong> <span id="gender">-</span></p>
                <p><strong>Age:</strong> <span id="dob">-</span></p>
            </div>
        </h2>
        <button class= "audits-btn" id="audits-btn">No audits</button>
        <button class="logout-btn" id="logout-btn">Logout</button>
    </div>
    <div class="stats">
        <div class="stat-card">XP: <span id="xp">0</span></div>
        <div class="stat-card">Grade: <span id="grade">0</span></div>
        <div class="stat-card">Audit Ratio: <span id="audits">0</span></div>
    </div>
    <div class="graph-section">
        <h3>Statistics</h3>
        <div class="skills-section">
            <h3>Top 5 Skills</h3>
            <div id="skills-container"></div>
        </div>
    </div>
    </div>
`