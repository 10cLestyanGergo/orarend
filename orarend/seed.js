// seed.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./timetable.db');

db.serialize(() => {
  db.run('DELETE FROM timetable');

  const stmt = db.prepare('INSERT INTO timetable (day, hour, subject) VALUES (?, ?, ?)');

  const seedData = [
    ['Hétfő', 1, 'Matematika'],
    ['Hétfő', 2, 'Magyar'],
    ['Kedd', 1, 'Fizika'],
    ['Kedd', 2, 'Történelem'],
    ['Szerda', 3, 'Angol'],
    ['Csütörtök', 4, 'Biológia'],
    ['Péntek', 5, 'Testnevelés'],
  ];

  seedData.forEach(([day, hour, subject]) => {
    stmt.run(day, hour, subject);
  });

  stmt.finalize();
});

db.close(() => {
  console.log('Adatbázis feltöltve seed adatokkal.');
});
