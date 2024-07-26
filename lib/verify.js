import * as fs from 'fs'
import * as path from 'path'
import * as zlib from 'zlib'
import { pipeline } from 'node:stream'
import { log } from './logger.js'

export function verifyFiles(directory) {
    return new Promise((resolve, reject) => {
        const alsFiles = getAlsFiles(directory) // Implement this function to get all ALS files

        let verifiedFiles = 0
        const totalFiles = alsFiles.length

        alsFiles.forEach(alsFile => {
            const xmlCacheDir = path.join(path.dirname(alsFile), '.xml_cache')
            const xmlFile = path.join(xmlCacheDir, path.basename(alsFile, '.als') + '.xml')
            
            if (!fs.existsSync(xmlFile)) {
                log(`XML file not found for ${alsFile}`)
                verifiedFiles++
                if (verifiedFiles === totalFiles) resolve()
                return
            }

            const tempFile = path.join(directory, `temp_${Date.now()}.xml`)
            const input = fs.createReadStream(alsFile)
            const unzip = zlib.createUnzip()
            const output = fs.createWriteStream(tempFile)

            pipeline(input, unzip, output, (error) => {
                if (error) {
                    log(`Verification failed for ${alsFile}: ${error}`)
                } else {
                    const oldXml = fs.readFileSync(xmlFile, 'utf8')
                    const newXml = fs.readFileSync(tempFile, 'utf8')
                    if (oldXml === newXml) {
                        log(`${alsFile} has not been modified`)
                    } else {
                        log(`${alsFile} has been modified since last processing`)
                    }
                }
                fs.unlinkSync(tempFile)
                verifiedFiles++
                if (verifiedFiles === totalFiles) resolve()
            })
        })
    })
}