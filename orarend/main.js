// main.js
const apiUrl = 'http://localhost:3000/api/timetable';

async function loadTimetable() {
  const res = await fetch(apiUrl);
  const data = await res.json();
  const container = document.getElementById('timetable');
  container.innerHTML = '';

  data.forEach((item) => {
    const div = document.createElement('div');
    div.innerHTML = `${item.day} - ${item.hour}. óra: ${item.subject} 
      <button onclick="deleteClass(${item.id})">Törlés</button>`;
    container.appendChild(div);
  });
}

async function deleteClass(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  loadTimetable();
}

document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const day = document.getElementById('day').value;
  const hour = document.getElementById('hour').value;
  const subject = document.getElementById('subject').value;

  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ day, hour, subject }),
  });

  document.getElementById('addForm').reset();
  loadTimetable();
});

loadTimetable();
