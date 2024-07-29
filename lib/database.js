import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import * as path from 'path'

const dbFile = path.join(process.cwd(), 'alsFiles.json')
const adapter = new JSONFile(dbFile)
const defaultData = { files: [] }
const db = new Low(adapter, defaultData)

export async function initDB() {
    await db.read()
    if (!db.data) {
        db.data = defaultData
        await db.write()
    }
}

export async function saveToDB(data) {
    db.data.files = data
    await db.write()
}

export async function getFromDB() {
    await db.read()
    return db.data.files
}