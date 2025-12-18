function lookup() {
  const phone = document.getElementById("phone").value;
  const status = document.getElementById("status");
  const cards = document.getElementById("cards");
  const systemMsg = document.getElementById("system-message");

  // Hide system message and show loading
  systemMsg.style.display = "none";
  status.innerText = "Searching database...";
  status.className = "terminal-status loading";
  cards.innerHTML = "";

  fetch("/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  })
    .then((r) => r.json())
    .then((d) => {
      status.innerText = "";
      status.className = "terminal-status";

      if (d.error) {
        status.innerText = "ERROR: " + d.error;
        systemMsg.style.display = "block";
        return;
      }

      if (!d.records || d.records.length === 0) {
        status.innerText = "No data found in database";
        systemMsg.style.display = "block";
        return;
      }

      // Add "Found X Records" header
      const recordCount = d.records.length;
      cards.innerHTML = `
      <div class="records-header-terminal">
        &gt; Found ${recordCount} Record${recordCount !== 1 ? "s" : ""} in Database
      </div>
    `;

      d.records.forEach((rec, index) => {
        cards.innerHTML += `
      <div class="card">
        <div class="card-header-terminal">
          <span class="card-number-terminal">&gt; Record #${index + 1}</span>
          <span class="card-title-terminal">[ SIM DATA ]</span>
        </div>
        <div class="card-body-terminal">
          <div class="field-row-terminal">
            <div class="field-label-terminal">&gt; NAME</div>
            <div class="field-value-terminal">${rec.Name || "N/A"}</div>
          </div>
          
          <div class="field-row-terminal">
            <div class="field-label-terminal">&gt; PHONE</div>
            <div class="field-value-terminal">${rec.Mobile}</div>
          </div>
          
          <div class="field-row-terminal">
            <div class="field-label-terminal">&gt; CNIC</div>
            <div class="field-value-terminal">${rec.CNIC || "N/A"}</div>
          </div>
          
          <div class="field-row-terminal">
            <div class="field-label-terminal">&gt; ADDRESS</div>
            <div class="field-value-terminal">${rec.Address || "N/A"}</div>
          </div>
          
          <div class="field-row-terminal">
            <div class="field-label-terminal">&gt; COUNTRY</div>
            <div class="field-value-terminal">${rec.Country || "N/A"}</div>
          </div>
        </div>
      </div>`;
      });
    })
    .catch(() => {
      status.innerText = "ERROR: Connection failed";
      status.className = "terminal-status";
      systemMsg.style.display = "block";
    });
}

// Allow Enter key to trigger search
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("phone").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      lookup();
    }
  });
});
