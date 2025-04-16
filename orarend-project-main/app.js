import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import { initializeDatabase, dbAll, dbRun } from './util/database.js'

// 🔧 Ezek KELLEN ahhoz, hogy __dirname működjön ES Module-ban:
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// 🔐 Middleware-k
app.use(cors())
app.use(express.json())

// 🧾 Statikus fájlok kiszolgálása
app.use(express.static(path.join(__dirname, 'public')))

// 📡 API végpontok
app.get('/api/schedule', async (req, res) => {
    const rows = await dbAll("SELECT * FROM schedule ORDER BY day, hour")
    res.json(rows)
})

app.post('/api/schedule', async (req, res) => {
    const { day, hour, subject } = req.body

    const existing = await dbAll("SELECT * FROM schedule WHERE day = ? AND hour = ?", [day, hour])
    if (existing.length > 0) {
        return res.status(400).json({ message: 'Hiba: már van óra ezen a napon ebben az időpontban.' })
    }

    await dbRun("INSERT INTO schedule (day, hour, subject) VALUES (?, ?, ?)", [day, hour, subject])
    res.status(201).json({ message: 'Óra hozzáadva.' })
})

app.delete('/api/schedule/:id', async (req, res) => {
    const { id } = req.params
    await dbRun("DELETE FROM schedule WHERE id = ?", [id])
    res.json({ message: 'Óra törölve.' })
})

app.use((err, req, res, next) => {
    res.status(500).json({ message: `Hiba: ${err.message}` })
})

async function startServer() {
    await initializeDatabase()
    app.listen(3000, () => {
        console.log('Szerver elindult: http://localhost:3000')
    })
}

startServer()