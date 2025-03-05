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
            <h2>Welcome, <span id="username">Loading...</span></h2>
            <button class="logout-btn" id="logout-btn">Logout</button>
        </div>
        <div class="stats">
            <div class="stat-card">XP: <span id="xp">0</span></div>
            <div class="stat-card">Grade: <span id="grade">0</span></div>
            <div class="stat-card">Audit Ratio: <span id="audits">0</span></div>
        </div>
        <div class="graph-section">
            <h3>Statistics</h3>
            <svg id="graph1"></svg>
            <svg id="graph2"></svg>
        </div>
    </div>
`