// Function to update audits dynamically
export function updateAudits(audits) {
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