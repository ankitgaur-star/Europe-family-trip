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

  // 🏠 HOME (SMART DASHBOARD)
  if (page === "home") {
    const itinerary = await fetchSheet("Itinerary");
    const flights = await fetchSheet("Flights");

    const today = new Date().toISOString().slice(0, 10);

    let html = "<h2>Trip Overview</h2>";

    // ✈️ Next Flight
    if (flights.length) {
      flights.sort((a, b) => a.Date.localeCompare(b.Date));
      const nextFlight = flights.find(f => f.Date >= today);

      if (nextFlight) {
        html += `
        <div class="card">
          ✈️ <strong>Next Flight</strong><br>
          ${nextFlight.From} → ${nextFlight.To}<br>
          📅 ${nextFlight.Date}<br>
          🕒 ${nextFlight.Departure}
        </div>`;
      }
    }

    // 📅 Next Itinerary
    const upcoming = itinerary
      .filter(i => i.Date >= today)
      .sort((a, b) => a.Date.localeCompare(b.Date))[0];

    if (upcoming) {
      const sameDay = itinerary.filter(i => i.Date === upcoming.Date);

      html += `<h3>Next Plan</h3>`;

      sameDay.forEach(i => {
        html += `
        <div class="card">
          📍 <strong>${i.City}</strong><br>
          ${i.Activity}<br>
          ${i.Time || ""}<br>
          ${i.Map ? `<a class="link" href="${i.Map}" target="_blank">Open Map</a>` : ""}
        </div>`;
      });
    }

    container.innerHTML = html;
  }

  // 📅 ITINERARY
  if (page === "itinerary") {
    const data = await fetchSheet("Itinerary");
    const grouped = groupByDay(data);

    let html = "<h2>Itinerary</h2>";

    Object.keys(grouped).forEach(day => {
      html += `<h3>Day ${day}</h3>`;

      grouped[day].forEach(i => {
        html += `
        <div class="card">
          📍 <strong>${i.City}</strong><br>
          ${i.Activity}<br>
          ${i.Time || ""}<br>
          ${i.Map ? `<a class="link" href="${i.Map}" target="_blank">Map</a>` : ""}
        </div>`;
      });
    });

    container.innerHTML = html;
  }

  // ✈️ FLIGHTS
  if (page === "flights") {
    const data = await fetchSheet("Flights");

    let html = "<h2>Flights</h2>";

    data.sort((a, b) => a.Date.localeCompare(b.Date));

    data.forEach(f => {
      html += `
      <div class="card">
        ✈️ <strong>${f.Airline} ${f.Flight}</strong><br>
        ${f.From} → ${f.To}<br>
        📅 ${f.Date}<br>
        🕒 ${f.Departure} → ${f.Arrival}<br>
        ${f.Ticket ? `<a class="link" href="${f.Ticket}" target="_blank">Ticket</a>` : ""}
      </div>`;
    });

    container.innerHTML = html;
  }

  // 🏨 HOTELS
  if (page === "hotels") {
    const data = await fetchSheet("Hotels");

    let html = "<h2>Hotels</h2>";

    data.forEach(h => {
      html += `
      <div class="card">
        🏨 <strong>${h.City}</strong><br>
        ${h.Hotel}<br>
        ${h.CheckIn} → ${h.CheckOut}<br>
        ${h.Map ? `<a class="link" href="${h.Map}" target="_blank">Map</a>` : ""}
      </div>`;
    });

    container.innerHTML = html;
  }

  // 🎟 TICKETS (NEW)
  if (page === "tickets") {
    const data = await fetchSheet("Tickets");

    let html = "<h2>Tickets</h2>";

    data.forEach(t => {
      html += `
      <div class="card">
        🎟 <strong>${t.Name}</strong><br>
        ${t.City}<br>
        📅 ${t.Date} ${t.Time || ""}<br>
        ${t.Ticket ? `<a class="link" href="${t.Ticket}" target="_blank">Open Ticket</a>` : ""}
      </div>`;
    });

    container.innerHTML = html;
  }

  // 🚆 TRANSPORT
  if (page === "transport") {
    const data = await fetchSheet("Transport");

    let html = "<h2>Transport</h2>";

    data.forEach(t => {
      html += `
      <div class="card">
        🚆 ${t.Type}<br>
        ${t.From} → ${t.To}<br>
        📅 ${t.Date || ""} ${t.Time || ""}
      </div>`;
    });

    container.innerHTML = html;
  }

  // 🍝 RESTAURANTS
  if (page === "restaurants") {
    const data = await fetchSheet("Restaurants");

    let html = "<h2>Food</h2>";

    data.forEach(r => {
      html += `
      <div class="card">
        🍝 <strong>${r.Name}</strong><br>
        ${r.City}<br>
        ${r.Cuisine || ""}<br>
        ${r.Map ? `<a class="link" href="${r.Map}" target="_blank">Map</a>` : ""}
      </div>`;
    });

    container.innerHTML = html;
  }

  // 🎒 PACKING
  if (page === "packing") {
    const data = await fetchSheet("Packing");

    let html = "<h2>Packing</h2>";

    data.forEach(p => {
      html += `<div class="card">☐ ${p.Item}</div>`;
    });

    container.innerHTML = html;
  }

  // 💰 EXPENSES
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
}

// default
showPage("home");
