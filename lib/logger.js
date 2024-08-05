import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'


class Logger {
    constructor() {
        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        this.logDir = path.join(__dirname, '..', 'logs')
        this.logFile = this.createLogFile()
        this.ensureLogDirectory()
    }

    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true })
        }
    }

    createLogFile() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        return path.join(this.logDir, `process-${timestamp}.log`)
    }

    log(message) {
        const timestamp = new Date().toISOString()
        const logMessage = `${timestamp} - ${message}\n`
        fs.appendFileSync(this.logFile, logMessage)
    }
}

const logger = new Logger()

export function log(message) {
    logger.log(message)
}