import * as fs from 'fs'
import * as path from 'path'

const logFile = path.join(process.cwd(), 'process.log')

export function log(message) {
    const timestamp = new Date().toISOString()
    const logMessage = `${timestamp} - ${message}\n`
    fs.appendFileSync(logFile, logMessage)
}

