export function drawSkillPies(skills) {
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