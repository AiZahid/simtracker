function lookup() {
  const phone = document.getElementById("phone").value;
  const status = document.getElementById("status");
  const cards = document.getElementById("cards");
  const systemMsg = document.getElementById("system-message");

  console.log("Lookup called with phone:", phone);

  // Validate input
  if (!phone || phone.length !== 10) {
    status.innerText = "ERROR: Phone number must be 10 digits";
    status.className = "terminal-status";
    return;
  }

  // Hide system message and show loading
  systemMsg.style.display = "none";
  status.innerText = "Searching database...";
  status.className = "terminal-status loading";
  cards.innerHTML = "";

  console.log("Making API request to:", "/lookup");
  console.log("Request body:", JSON.stringify({ phone }));

  fetch("/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  })
    .then((r) => {
      console.log("Response status:", r.status);
      return r.json();
    })
    .then((d) => {
      console.log("Response data:", d);
      status.innerText = "";
      status.className = "terminal-status";

      if (d.error) {
        console.error("API Error:", d.error);
        status.innerText = "ERROR: " + d.error;
        if (d.details) {
          console.error("Error details:", d.details);
        }
        systemMsg.style.display = "block";
        return;
      }

      if (!d.records || d.records.length === 0) {
        console.log("No records found");
        status.innerText = "No data found in database";
        systemMsg.style.display = "block";
        return;
      }

      console.log("Found", d.records.length, "records");

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
    .catch((error) => {
      console.error("Fetch error:", error);
      status.innerText = "ERROR: Connection failed - " + error.message;
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

  // Auto-show WhatsApp popup on every page load
  setTimeout(function () {
    openWhatsAppPopup();
  }, 1000); // 1 second delay for better UX
});

// WhatsApp Popup Functions
function openWhatsAppPopup() {
  const modal = document.getElementById("whatsappModal");
  modal.style.display = "block";
}

function closeWhatsAppPopup() {
  const modal = document.getElementById("whatsappModal");
  modal.style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("whatsappModal");
  if (event.target === modal) {
    closeWhatsAppPopup();
  }
}
