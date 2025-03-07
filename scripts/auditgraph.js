import { opt } from "./utils.js";
export function createXPBarGraph(xpReceived, xpGiven) {
    // Calculate audit ratio (avoid division by zero)
    const auditRatio = xpGiven > 0 ? (xpGiven / xpReceived).toFixed(1) : "N/A";

    // Create SVG container
    const svgWidth = 400;
    const svgHeight = 250;
    const barWidth = 100;
    const maxXP = Math.max(xpReceived, xpGiven); // Normalize heights

    const svg = `
    <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
      <!-- XP Received Bar -->
      <rect x="50" y="${200 - (xpReceived / maxXP) * 150
        }" width="${barWidth}" height="${(xpReceived / maxXP) * 150
        }" fill="#6366f1"></rect>
      <text x="100" y="220" text-anchor="middle" fill="white">Received(${opt(xpReceived)})</text>

      <!-- XP Given Bar -->
      <rect x="200" y="${200 - (xpGiven / maxXP) * 150
        }" width="${barWidth}" height="${(xpGiven / maxXP) * 150
        }" fill="#6366f1"></rect>
      <text x="250" y="220" text-anchor="middle" fill="white">Given(${opt(xpGiven)})</</text>
    </svg>

    <!-- Audit Ratio -->
    <div style="text-align: center; font-size: 18px; margin-top: 10px;">
      <strong>Audit Ratio:</strong> ${auditRatio}
    </div>
  `;

    document.getElementById("xp-graph-container").innerHTML = svg;
}
