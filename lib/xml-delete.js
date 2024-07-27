import * as fs from 'fs'
import * as path from 'path'
import { log } from './logger.js'

export function xmlDelete(directoryPath) {
    return new Promise((resolve, reject) => {
        function deleteHiddenXMLFiles(dir) {
            const files = fs.readdirSync(dir)
        
            files.forEach(file => {
                const filePath = path.join(dir, file)
                const stats = fs.statSync(filePath)
        
                if (stats.isDirectory()) {
                    if (file !== 'Backup') {
                        deleteHiddenXMLFiles(filePath)
                    }
                } else if (file.startsWith('.') && file.endsWith('.xml')) {
                    fs.unlinkSync(filePath)
                    log(`Deleted hidden XML file: ${filePath}`)
                }
            })
        }

        try {
            deleteHiddenXMLFiles(directoryPath)
            log(`Hidden XML file deletion process completed for directory: ${directoryPath}`)
            resolve()
        } catch (error) {
            log(`An error occurred during hidden XML file deletion: ${error.message}`)
            reject(error)
        }
    })
}