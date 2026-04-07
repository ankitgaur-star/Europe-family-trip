const SHEET_ID = "10FyRal7ybfEGR_DgXV5Y3WHlGaiLAcltFnyEFbeL_kA";

async function fetchSheet(sheetName) {
  try {
    const url = `https://opensheet.elk.sh/${SHEET_ID}/${sheetName}`;
    const res = await fetch(url);
    return await res.json();
  } catch (e) {
    console.error("Error loading", sheetName);
    return [];
  }
}

async function showPage(page) {
  const container = document.getElementById("content");

  try {

    // 🏠 HOME (PREMIUM UI)
if (page === "home") {
  const data = await fetchSheet("Itinerary");

  const today = new Date().toISOString().slice(0, 10);

  // Get all unique dates sorted
  const dates = [...new Set(data.map(i => i.Date))]
    .sort((a, b) => a.localeCompare(b));

  // Find next date >= today
  let targetDate = dates.find(d => d >= today);

  // If none found (trip over), fallback to last date
  if (!targetDate) {
    targetDate = dates[dates.length - 1];
  }

  // Filter that day's items
  const dayItems = data
    .filter(i => i.Date === targetDate)
    .sort((a, b) => (a.Time || "").localeCompare(b.Time || ""));

  let html = "<h2>Next Plan</h2>";

  if (dayItems.length) {
  const cities = [...new Set(dayItems.map(i => i.City))];

html += `<h3>${cities.join(" → ")} • ${targetDate}</h3>`;

    dayItems.forEach(i => {
      html += `
      <div class="card">
        <strong>${i.Activity}</strong>
        <div class="meta">${i.Time || ""}</div>
      </div>`;
    });
  } else {
    html += "<div class='card'>No plans found</div>";
  }

  container.innerHTML = html;
}
    // 📅 ITINERARY (PREMIUM UI)
  if (page === "itinerary") {
  const data = await fetchSheet("Itinerary");

  const grouped = {};

  data.forEach(item => {
    if (!grouped[item.Day]) grouped[item.Day] = [];
    grouped[item.Day].push(item);
  });

  let html = "<h2>Itinerary</h2>";

  Object.keys(grouped)
    .sort((a, b) => Number(a) - Number(b))
    .forEach(day => {

      html += `<h3>Day ${day}</h3>`;

const sorted = grouped[day].sort((a, b) => {
  const t1 = a.Time ? a.Time.split(":").map(Number) : [99, 99];
  const t2 = b.Time ? b.Time.split(":").map(Number) : [99, 99];

  return t1[0] !== t2[0]
    ? t1[0] - t2[0]
    : t1[1] - t2[1];
});

      sorted.forEach(i => {
        html += `
        <div class="card">
          <strong>${i.Activity || ""}</strong>
          <div class="meta">${i.City || ""} • ${i.Time || ""}</div>

          ${i.Notes ? `<div class="meta">${i.Notes}</div>` : ""}

          ${i.Map ? `<a class="button" href="${i.Map}" target="_blank">View Map</a>` : ""}
        </div>`;
      });

    });

  container.innerHTML = html;
}
    // ✈️ FLIGHTS
    if (page === "flights") {
      const data = await fetchSheet("Flights");

      let html = "<h2>Flights</h2>";

      data.sort((a, b) => (a.Date || "").localeCompare(b.Date || ""));

      data.forEach(f => {
        html += `
        <div class="card">
          ✈️ <strong>${f.Airline} ${f.Flight}</strong><br>
          ${f.From} → ${f.To}<br>
          📅 ${f.Date}<br>
          🕒 ${f.Departure} → ${f.Arrival}<br>
          ${f.Ticket ? `<a class="button" href="${f.Ticket}" target="_blank">Ticket</a>` : ""}
        </div>`;
      });

      container.innerHTML = html;
    }

    // 🛏️ HOTELS
    if (page === "hotels") {
      const data = await fetchSheet("Hotels");

      let html = "<h2>Hotels</h2>";

      data.forEach(h => {
        html += `
        <div class="card">
       🛏️ <strong>${h.City}</strong>
          ${h.Hotel}<br>
          ${h.CheckIn} → ${h.CheckOut}<br>
          ${h.Address ? `<a class="button" href="${h.Address}" target="_blank">Address</a>` : ""}
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
      
      <div class="date">${t.Date || ""} ${t.Time || ""}</div>

      🚆 <strong>${t.Type}</strong><br>
      ${t.From} → ${t.To}<br>

      ${t.Booking ? `<div class="meta">Booking: ${t.Booking}</div>` : ""}
      ${t.Notes ? `<div class="meta">Notes: ${t.Notes}</div>` : ""}
    </div>`;
  });

  container.innerHTML = html;
}

    // 🍽️ RESTAURANTS
    if (page === "restaurants") {
      const data = await fetchSheet("Restaurants");

      let html = "<h2>Food</h2>";

      data.forEach(r => {
        html += `
        <div class="card">
      🍽️ <strong>${r.Name}</strong>
          ${r.City}<br>
          ${r.Cuisine || ""}<br>
          ${r.Map ? `<a class="button" href="${r.Map}" target="_blank">View Map</a>` : ""}
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

  } catch (e) {
    container.innerHTML = "<div class='card'>Something went wrong</div>";
    console.error(e);
  }
}

// default page
showPage("home");
