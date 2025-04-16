// server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors()); // CORS engedélyezés
app.use(bodyParser.json());

// SQLite adatbázis
const db = new sqlite3.Database('./timetable.db');

// Táblázat létrehozása
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS timetable (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT NOT NULL,
      hour INTEGER NOT NULL,
      subject TEXT NOT NULL
    )
  `);
});

// Órarend lekérése
app.get('/api/timetable', (req, res) => {
  db.all('SELECT * FROM timetable', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Új tanóra hozzáadása
app.post('/api/timetable', (req, res) => {
  const { day, hour, subject } = req.body;
  if (!day || !hour || !subject) {
    return res.status(400).json({ error: 'Hiányzó adatok' });
  }
  db.run(
    'INSERT INTO timetable (day, hour, subject) VALUES (?, ?, ?)',
    [day, hour, subject],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, day, hour, subject });
    }
  );
});

// Tanóra törlése
app.delete('/api/timetable/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM timetable WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes > 0 });
  });
});

app.listen(PORT, () => {
  console.log(`API fut a http://localhost:${PORT} címen`);
});
