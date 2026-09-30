// ---------- Local persistence ----------
// Real browsers don't have window.storage (that only exists inside
// claude.ai artifacts). This wraps localStorage with the same
// get/set/delete shape so the rest of the app doesn't need to change.
const storage = {
  async get(key){
    const value = localStorage.getItem(key);
    return value === null ? null : { value };
  },
  async set(key, value){
    localStorage.setItem(key, value);
  },
  async delete(key){
    localStorage.removeItem(key);
  }
};

// ---------- State ----------
let state = {
  destination: "Rome",
  travelers: 2,
  startDate: null,
  endDate: null,
  kashrutLevel: "standard",
  activeCategory: "all",
  itinerary: {}, // { "2026-09-14": [placeId, ...] }
  dayNotes: {},  // { "2026-09-14": "free-text note" }
  tripCode: null
};

function findPlace(id){
  for (const city in DATA){
    const hit = DATA[city].find(p => p.id === id);
    if (hit) return {...hit, city};
  }
  return null;
}

// ---------- Directory rendering ----------
function renderDirectory(){
  const grid = document.getElementById('directory-grid');
  const heading = document.getElementById('directory-heading');
  heading.textContent = `Kosher directory — ${state.destination}`;
  const places = DATA[state.destination].filter(p =>
    state.activeCategory === 'all' || p.cat === state.activeCategory
  );
  if (places.length === 0){
    grid.innerHTML = `<div class="empty-directory">No listings in this category yet for ${state.destination}.</div>`;
    return;
  }
  grid.innerHTML = places.map(p => {
    const added = isPlaceInAnyDay(p.id);
    return `
    <div class="place-card">
      <div class="place-top">
        <div>
          <div class="place-cat">${labelForCat(p.cat)}</div>
          <div class="place-name">${p.name}</div>
          <div class="place-city">${state.destination}, ${CITY_META[state.destination].country}</div>
        </div>
        ${p.hechsher !== '—' ? `<div class="hechsher-badge">${p.hechsher.split(' ')[0]}</div>` : ''}
      </div>
      <div class="place-desc">${p.desc}</div>
      <div class="place-tags">
        ${p.level !== '—' ? `<span class="tag">${p.level}</span>` : ''}
        ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="place-foot">
        <span class="mono" style="font-size:11px; color:var(--ink-soft);">${p.hechsher}</span>
        <button class="add-btn ${added ? 'added' : ''}" onclick="addToItinerary('${p.id}', this)">${added ? '✓ In itinerary' : '+ Add to day'}</button>
      </div>
    </div>`;
  }).join('');
}

function labelForCat(cat){
  return {restaurant:"Restaurant", hotel:"Hotel", synagogue:"Synagogue", store:"Grocery & Store"}[cat] || cat;
}

function isPlaceInAnyDay(id){
  return Object.values(state.itinerary).some(arr => arr.includes(id));
}

// ---------- Itinerary logic ----------
function getDateRange(){
  if (!state.startDate || !state.endDate) return [];
  const dates = [];
  let d = new Date(state.startDate);
  const end = new Date(state.endDate);
  while (d <= end){
    dates.push(new Date(d).toISOString().slice(0,10));
    d.setDate(d.getDate()+1);
  }
  return dates;
}

function addToItinerary(placeId, btn){
  const dates = getDateRange();
  if (dates.length === 0){
    alert("Set your travel dates in Trip Setup first, so each place lands on a real day.");
    document.getElementById('setup').scrollIntoView();
    return;
  }
  // add to the first day that doesn't already have it, defaulting to day 1
  const targetDay = dates.find(d => !(state.itinerary[d]||[]).includes(placeId)) || dates[0];
  if (!state.itinerary[targetDay]) state.itinerary[targetDay] = [];
  if (!state.itinerary[targetDay].includes(placeId)){
    state.itinerary[targetDay].push(placeId);
  }
  renderDirectory();
  renderItinerary();
}

function removeFromItinerary(date, placeId){
  state.itinerary[date] = (state.itinerary[date]||[]).filter(id => id !== placeId);
  renderDirectory();
  renderItinerary();
}

function renderItinerary(){
  const container = document.getElementById('itinerary-container');
  const dates = getDateRange();
  if (dates.length === 0){
    container.innerHTML = `<div class="empty-itinerary">Set your departure and return dates in Trip Setup, then add places from the directory — they'll land here as day-by-day tickets.</div>`;
    return;
  }
  container.innerHTML = `<div class="day-tickets">${dates.map((date, i) => {
    const items = (state.itinerary[date] || []).map(id => findPlace(id)).filter(Boolean);
    const dObj = new Date(date + 'T00:00:00');
    const dayLabel = dObj.toLocaleDateString('en-US', {weekday:'long'});
    const dateLabel = dObj.toLocaleDateString('en-US', {month:'short', day:'numeric'});
    return `
    <div class="ticket">
      <div class="ticket-main">
        <div class="ticket-day-label">Day ${i+1} · ${dayLabel}</div>
        ${items.length === 0
          ? `<div class="empty-day">Nothing added yet for this day.</div>`
          : items.map(item => `
            <div class="itinerary-item">
              <div class="item-left">
                <span class="item-cat-dot"></span>
                <div>
                  <div class="item-name">${item.name}</div>
                  <div class="item-meta">${labelForCat(item.cat)} · ${item.level !== '—' ? item.level : 'Visit'}</div>
                </div>
              </div>
              <button class="remove-btn" aria-label="Remove ${item.name}" onclick="removeFromItinerary('${date}','${item.id}')">×</button>
            </div>`).join('')}
        <div class="day-note">
          <label for="note-${date}" class="form-note">Note for this day</label>
          <textarea id="note-${date}" placeholder="e.g. call ahead to confirm the reservation" onchange="updateDayNote('${date}', this.value)">${escapeHtml(state.dayNotes[date] || '')}</textarea>
        </div>
      </div>
      <div class="ticket-stub">
        <div class="ticket-day-label">Boarding</div>
        <div class="ticket-date">${dateLabel}</div>
        <div class="ticket-city">${state.destination}</div>
        <div class="stub-code mono">KP-${String(i+1).padStart(2,'0')}-${state.destination.slice(0,3).toUpperCase()}</div>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function updateDayNote(date, value){
  state.dayNotes[date] = value;
}

// ---------- AI itinerary generation ----------
// Calls our own backend (server.js -> /api/generate-itinerary), which holds
// the real Anthropic API key server-side. The browser never sees the key.
async function generateAIItinerary(){
  const dates = getDateRange();
  const statusEl = document.getElementById('ai-status');
  const btn = document.getElementById('ai-generate-btn');

  if (dates.length === 0){
    statusEl.textContent = "Set your departure and return dates above first.";
    statusEl.classList.add('error');
    document.getElementById('setup').scrollIntoView();
    return;
  }

  const places = DATA[state.destination];
  btn.disabled = true;
  statusEl.classList.remove('error');
  statusEl.innerHTML = `<span class="spinner" style="border-color:rgba(51,69,107,0.3); border-top-color:var(--ink-soft); display:inline-block; vertical-align:middle; margin-right:6px;"></span> Building your itinerary…`;

  try {
    const response = await fetch('/api/generate-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination: state.destination,
        dates,
        kashrutLevel: state.kashrutLevel,
        travelers: state.travelers,
        places
      })
    });

    const parsed = await response.json();
    if (!response.ok){
      throw new Error(parsed.error || 'Server error');
    }

    // only accept days that fall in range and place ids that actually exist
    const validIds = new Set(places.map(p => p.id));
    const cleaned = {};
    for (const date of dates){
      const list = (parsed[date] || []).filter(id => validIds.has(id));
      if (list.length) cleaned[date] = list;
    }
    state.itinerary = cleaned;
    renderDirectory();
    renderItinerary();
    statusEl.textContent = "Itinerary generated. Review it below — you can still add or remove places by hand.";
  } catch (err) {
    statusEl.classList.add('error');
    statusEl.textContent = err.message.includes('ANTHROPIC_API_KEY')
      ? "The server needs an Anthropic API key configured (see .env.example)."
      : "Couldn't generate an itinerary automatically. Try again, or add places manually below.";
  } finally {
    btn.disabled = false;
  }
}

// ---------- Save / load trips (localStorage, this browser only) ----------
function randomTripCode(){
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i=0;i<6;i++) code += chars[Math.floor(Math.random()*chars.length)];
  return code;
}

async function saveCurrentTrip(){
  const saveStatus = document.getElementById('save-status');
  if (!state.tripCode) state.tripCode = randomTripCode();
  const record = {
    code: state.tripCode,
    destination: state.destination,
    travelers: state.travelers,
    startDate: state.startDate,
    endDate: state.endDate,
    kashrutLevel: state.kashrutLevel,
    itinerary: state.itinerary,
    dayNotes: state.dayNotes,
    savedAt: new Date().toISOString()
  };
  try {
    await storage.set(`trip:${state.tripCode}`, JSON.stringify(record));
    // update index
    let index = [];
    try {
      const existing = await storage.get('trip-index');
      index = existing ? JSON.parse(existing.value) : [];
    } catch(e){ index = []; }
    index = index.filter(c => c !== state.tripCode);
    index.unshift(state.tripCode);
    await storage.set('trip-index', JSON.stringify(index));

    document.getElementById('current-trip-code').textContent = state.tripCode;
    saveStatus.textContent = "Saved. Keep this code to reload the trip later, on this device.";
    renderSavedTrips();
  } catch (err) {
    saveStatus.textContent = "Couldn't save right now — try again in a moment.";
  }
}

async function loadTripByCode(code){
  const saveStatus = document.getElementById('save-status');
  if (!code){ saveStatus.textContent = "Enter a trip code first."; return; }
  try {
    const result = await storage.get(`trip:${code.toUpperCase()}`);
    if (!result){ saveStatus.textContent = "No trip found for that code."; return; }
    const record = JSON.parse(result.value);
    applyTripRecord(record);
    saveStatus.textContent = "Trip loaded.";
  } catch (err) {
    saveStatus.textContent = "No trip found for that code.";
  }
}

function applyTripRecord(record){
  state.destination = record.destination;
  state.travelers = record.travelers;
  state.startDate = record.startDate;
  state.endDate = record.endDate;
  state.kashrutLevel = record.kashrutLevel;
  state.itinerary = record.itinerary || {};
  state.dayNotes = record.dayNotes || {};
  state.tripCode = record.code;

  document.getElementById('destination').value = state.destination;
  document.getElementById('travelers').value = state.travelers;
  document.getElementById('start-date').value = state.startDate;
  document.getElementById('end-date').value = state.endDate;
  showDatesError(null);
  document.querySelectorAll('#kashrut-chips .chip').forEach(c => {
    c.classList.toggle('active', c.dataset.level === state.kashrutLevel);
  });
  document.getElementById('current-trip-code').textContent = state.tripCode;

  renderDirectory();
  renderItinerary();
}

async function deleteTrip(code){
  try {
    await storage.delete(`trip:${code}`);
    const existing = await storage.get('trip-index');
    let index = existing ? JSON.parse(existing.value) : [];
    index = index.filter(c => c !== code);
    await storage.set('trip-index', JSON.stringify(index));
    renderSavedTrips();
  } catch (err) {
    renderSavedTrips();
  }
}

async function renderSavedTrips(){
  const grid = document.getElementById('saved-trips-grid');
  let index = [];
  try {
    const existing = await storage.get('trip-index');
    index = existing ? JSON.parse(existing.value) : [];
  } catch (err) {
    index = [];
  }
  if (index.length === 0){
    grid.innerHTML = `<div class="empty-directory">No saved trips yet — save your current trip above to see it here.</div>`;
    return;
  }
  const cards = [];
  for (const code of index){
    try {
      const result = await storage.get(`trip:${code}`);
      if (!result) continue;
      const record = JSON.parse(result.value);
      cards.push(`
        <div class="saved-trip-card">
          <div class="saved-trip-city">${record.destination}</div>
          <div class="saved-trip-meta">${record.startDate || '—'} → ${record.endDate || '—'}</div>
          <div class="saved-trip-code">${record.code}</div>
          <div class="saved-trip-actions">
            <button class="mini-btn" onclick='applyTripRecord(${JSON.stringify(record)})'>Load</button>
            <button class="mini-btn danger" onclick="deleteTrip('${record.code}')">Delete</button>
          </div>
        </div>`);
    } catch (err) { /* skip unreadable entries */ }
  }
  grid.innerHTML = cards.join('') || `<div class="empty-directory">No saved trips yet.</div>`;
}

// ---------- Event wiring ----------
function onDestinationChange(){
  state.destination = document.getElementById('destination').value;
  state.itinerary = {}; // itinerary is per-destination in this preview
  state.dayNotes = {};
  renderDirectory();
  renderItinerary();
}

function showDatesError(message){
  const row = document.getElementById('dates-error-row');
  const el = document.getElementById('dates-error');
  if (!message){
    row.style.display = 'none';
    el.textContent = '';
    return false;
  }
  row.style.display = '';
  el.textContent = message;
  return true;
}

function onDatesChange(){
  const startVal = document.getElementById('start-date').value || null;
  const endVal = document.getElementById('end-date').value || null;

  if (startVal && endVal && endVal < startVal){
    showDatesError("Your return date is before your departure date — check the dates above.");
    return; // don't apply invalid range to state
  }

  const MAX_TRIP_DAYS = 60;
  if (startVal && endVal){
    const days = (new Date(endVal) - new Date(startVal)) / 86400000;
    if (days > MAX_TRIP_DAYS){
      showDatesError(`That's a ${Math.round(days)}-day trip — trips longer than ${MAX_TRIP_DAYS} days aren't supported in this preview.`);
      return;
    }
  }

  showDatesError(null);
  state.startDate = startVal;
  state.endDate = endVal;
  renderItinerary();
}

function onTravelersChange(){
  const input = document.getElementById('travelers');
  const value = Math.max(1, parseInt(input.value, 10) || 1);
  input.value = value;
  state.travelers = value;
}

// ---------- Copy itinerary as plain text ----------
function copyItineraryText(){
  const dates = getDateRange();
  const statusEl = document.getElementById('copy-status');
  if (dates.length === 0){
    statusEl.textContent = "Add dates and places first.";
    return;
  }

  const lines = [`Kosher Passport — ${state.destination} itinerary`, ''];
  dates.forEach((date, i) => {
    const items = (state.itinerary[date] || []).map(id => findPlace(id)).filter(Boolean);
    const dObj = new Date(date + 'T00:00:00');
    lines.push(`Day ${i+1} — ${dObj.toLocaleDateString('en-US', {weekday:'long', month:'short', day:'numeric'})}`);
    if (items.length === 0){
      lines.push('  (nothing added yet)');
    } else {
      items.forEach(item => lines.push(`  - ${item.name} (${labelForCat(item.cat)}${item.level !== '—' ? ', ' + item.level : ''})`));
    }
    if (state.dayNotes[date]){
      lines.push(`  Note: ${state.dayNotes[date]}`);
    }
    lines.push('');
  });

  const text = lines.join('\n');

  const fallbackCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(textarea);
  };

  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(
      () => { statusEl.textContent = "Copied — paste it anywhere."; },
      () => { fallbackCopy(); statusEl.textContent = "Copied — paste it anywhere."; }
    );
  } else {
    fallbackCopy();
    statusEl.textContent = "Copied — paste it anywhere.";
  }
}

document.getElementById('kashrut-chips').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('#kashrut-chips .chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  state.kashrutLevel = chip.dataset.level;
});

document.getElementById('category-filters').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('#category-filters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.activeCategory = btn.dataset.cat;
  renderDirectory();
});

// ---------- Init ----------
(function init(){
  const today = new Date();
  const start = new Date(today); start.setDate(start.getDate() + 30);
  const end = new Date(start); end.setDate(end.getDate() + 6);
  document.getElementById('start-date').value = start.toISOString().slice(0,10);
  document.getElementById('end-date').value = end.toISOString().slice(0,10);
  state.startDate = start.toISOString().slice(0,10);
  state.endDate = end.toISOString().slice(0,10);
  renderDirectory();
  renderItinerary();
  renderSavedTrips();
})();
