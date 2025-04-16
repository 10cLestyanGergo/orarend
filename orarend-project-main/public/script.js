let currentDay = ''

document.getElementById('daySelect').addEventListener('change', (e) => {
  currentDay = e.target.value
  document.getElementById('currentDayLabel').innerText = currentDay
  if (currentDay) {
    document.getElementById('scheduleTable').style.display = 'table'
    document.getElementById('formSection').style.display = 'block'
    loadSchedule(currentDay)
  } else {
    document.getElementById('scheduleTable').style.display = 'none'
    document.getElementById('formSection').style.display = 'none'
  }
})

async function loadSchedule(day) {
  const res = await fetch('http://localhost:3000/api/schedule')
  const schedule = await res.json()
  const filtered = schedule.filter(entry => entry.day === day)

  const tbody = document.querySelector('#scheduleTable tbody')
  tbody.innerHTML = ''
  filtered.forEach(({ id, hour, subject }) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${hour}</td>
      <td>${subject}</td>
      <td><button onclick="deleteLesson(${id})">Törlés</button></td>
    `
    tbody.appendChild(tr)
  })
}

async function deleteLesson(id) {
  await fetch(`http://localhost:3000/api/schedule/${id}`, { method: 'DELETE' })
  loadSchedule(currentDay)
}

document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const hour = document.getElementById('hour').value
  const subject = document.getElementById('subject').value

  const res = await fetch('http://localhost:3000/api/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ day: currentDay, hour, subject })
  })

  if (res.ok) {
    e.target.reset()
    loadSchedule(currentDay)
  } else {
    const error = await res.json()
    alert(error.message) 
  }
})