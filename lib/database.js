import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Put db.json in parent folder
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbFile = path.join(__dirname, '..', 'db.json')

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
    await db.read()
    
    // Append new data to existing files
    const updatedFiles = [...db.data.files]
    
    data.forEach(newItem => {
        const existingIndex = updatedFiles.findIndex(item => item.filePath === newItem.filePath)
        if (existingIndex !== -1) {
            updatedFiles[existingIndex] = newItem
        } else {
            updatedFiles.push(newItem)
        }
    })
    
    db.data.files = updatedFiles
    await db.write()
}

export async function getFromDB() {
    await db.read()
    return db.data.files
}