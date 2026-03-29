const SHEET_ID = "10FyRal7ybfEGR_DgXV5Y3WHlGaiLAcltFnyEFbeL_kA";

async function fetchSheet(sheetName) {
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${sheetName}`;
  const res = await fetch(url);
  return await res.json();
}

function groupByDay(data) {
  const grouped = {};
  data.forEach(item => {
    if (!grouped[item.Day]) grouped[item.Day] = [];
    grouped[item.Day].push(item);
  });
  return grouped;
}

async function showPage(page) {
  const container = document.getElementById("content");

  if (page === "home") {
    const data = await fetchSheet("Itinerary");

    const today = new Date().toISOString().slice(0, 10);
    const todayItems = data.filter(i => i.Date === today);

    let html = "<h2>Today's Plan</h2>";

    if (todayItems.length) {
      todayItems.forEach(i => {
        html += `
        <div class="card">
          <strong>${i.City}</strong><br>
          ${i.Activity}<br>
          ${i.Time || ""}<br>
          ${i.Map ? `<a class="link" href="${i.Map}" target="_blank">📍 Map</a>` : ""}
        </div>`;
      });
    } else {
      html += "<div class='card'>No plans today 🎉</div>";
    }

    container.innerHTML = html;
  }

  if (page === "itinerary") {
    const data = await fetchSheet("Itinerary");
    const grouped = groupByDay(data);

    let html = "<h2>Itinerary</h2>";

    Object.keys(grouped).forEach(day => {
      html += `<h3>Day ${day}</h3>`;

      grouped[day].forEach(i => {
        html += `
        <div class="card">
          <strong>${i.City}</strong><br>
          ${i.Activity}<br>
          ${i.Time || ""}<br>
          ${i.Map ? `<a class="link" href="${i.Map}" target="_blank">📍 Map</a>` : ""}
        </div>`;
      });
    });

    container.innerHTML = html;
  }

  if (page === "flights") {
    const data = await fetchSheet("Flights");

    let html = "<h2>Flights</h2>";

    data.forEach(f => {
      html += `
      <div class="card">
        <strong>${f.Airline} ${f.Flight}</strong><br>
        ${f.From} → ${f.To}<br>
        ${f.Departure} → ${f.Arrival}<br>
        Booking: ${f.Booking || ""}
      </div>`;
    });

    container.innerHTML = html;
  }

  if (page === "hotels") {
    const data = await fetchSheet("Hotels");

    let html = "<h2>Hotels</h2>";

    data.forEach(h => {
      html += `
      <div class="card">
        <strong>${h.City}</strong><br>
        ${h.Hotel}<br>
        ${h.CheckIn} → ${h.CheckOut}<br>
        ${h.Map ? `<a class="link" href="${h.Map}" target="_blank">📍 Map</a>` : ""}
      </div>`;
    });

    container.innerHTML = html;
  }

  if (page === "restaurants") {
    const data = await fetchSheet("Restaurants");

    let html = "<h2>Restaurants</h2>";

    data.forEach(r => {
      html += `
      <div class="card">
        <strong>${r.Name}</strong><br>
        ${r.City}<br>
        ${r.Cuisine || ""}<br>
        ${r.Map ? `<a class="link" href="${r.Map}" target="_blank">📍 Map</a>` : ""}
      </div>`;
    });

    container.innerHTML = html;
  }

  if (page === "more") {
    container.innerHTML = `
      <div class="card"><button onclick="showPage('transport')">Transport</button></div>
      <div class="card"><button onclick="showPage('packing')">Packing</button></div>
      <div class="card"><button onclick="showPage('expenses')">Expenses</button></div>
      <div class="card"><button onclick="showPage('emergency')">Emergency</button></div>
    `;
  }

  if (page === "transport") {
    const data = await fetchSheet("Transport");

    let html = "<h2>Transport</h2>";

    data.forEach(t => {
      html += `
      <div class="card">
        ${t.Type}<br>
        ${t.From} → ${t.To}<br>
        ${t.Date || ""} ${t.Time || ""}
      </div>`;
    });

    container.innerHTML = html;
  }

  if (page === "packing") {
    const data = await fetchSheet("Packing");

    let html = "<h2>Packing</h2>";

    data.forEach(p => {
      html += `<div class="card">☐ ${p.Item}</div>`;
    });

    container.innerHTML = html;
  }

  if (page === "expenses") {
    const data = await fetchSheet("Expenses");

    let total = 0;
    let html = "<h2>Expenses</h2>";

    data.forEach(e => {
      const amt = Number(e.Amount || 0);
      total += amt;

      html += `
      <div class="card">
        ${e.Date} – ${e.City}<br>
        ${e.Category}<br>
        €${amt}
      </div>`;
    });

    html += `<div class="card"><strong>Total: €${total}</strong></div>`;
    container.innerHTML = html;
  }

  if (page === "emergency") {
    container.innerHTML = `
      <div class="card">
        <h2>Emergency</h2>
        Europe Emergency Number: <strong>112</strong>
      </div>`;
  }
}

showPage("home");