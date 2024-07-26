import * as fs from 'fs'
import * as path from 'path'
import { log } from './logger.js'
import chalk from 'chalk'

export function xmlDelete(directoryPath) {
    return new Promise((resolve, reject) => {
        // Find and delete .xml_cache folders
        function deleteXMLCacheFolders(dir) {
            const files = fs.readdirSync(dir)
        
            files.forEach(file => {
                const filePath = path.join(dir, file)
                const stats = fs.statSync(filePath)
        
                if (stats.isDirectory()) {
                    if (file === '.xml_cache') {
                        fs.rmSync(filePath, { recursive: true })
                        log(`Deleted .xml_cache folder: ${filePath}`)
                    } else {
                        deleteXMLCacheFolders(filePath)
                    }
                }
            })
        }

        try {
            deleteXMLCacheFolders(directoryPath)
            log(`XML cache deletion process completed for directory: ${directoryPath}`)
            resolve()
        } catch (error) {
            log(`An error occurred during XML cache deletion: ${error.message}`)
            reject(error)
        }
    })
}