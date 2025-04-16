import sqlite from 'sqlite3'

const db = new sqlite.Database('./data/database.sqlite')

export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
        })
    })
}

export function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err)
            else resolve(this)
        })
    })
}

export async function initializeDatabase() {
    await dbRun("DROP TABLE IF EXISTS schedule")
    await dbRun(`CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT,
        hour INTEGER,
        subject TEXT,
        UNIQUE(day, hour)
    );`)

    const subjects = [
        "Matematika", "Magyar", "Történelem", "Angol", "Fizika",
        "Biológia", "Kémia", "Testnevelés", "Informatika", "Osztályfőnöki"
    ]

    const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"]

    for (const day of days) {
        for (let hour = 1; hour <= 5; hour++) {
            const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
            await dbRun("INSERT INTO schedule (day, hour, subject) VALUES (?, ?, ?)", [day, hour, randomSubject])
        }
    }
}