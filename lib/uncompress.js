import * as fs from 'fs'
import * as path from 'path'
import * as zlib from 'zlib'
import { pipeline } from 'node:stream'
import { log } from './logger.js'
import chalk from 'chalk'

export function uncompress(inputDir) {
    return new Promise((resolve, reject) => {
        // Get all .als files in a directory and its subdirectories
        function getAlsFiles(dir, fileList = []) {
            const files = fs.readdirSync(dir)
        
            files.forEach(file => {
                const filePath = path.join(dir, file)
                if (fs.statSync(filePath).isDirectory()) {
                    // Ignore 'Backup' folder created by Live when saving for the second time
                    if (file !== 'Backup') {
                        getAlsFiles(filePath, fileList)
                    }
                } else if (path.extname(file) === '.als') {
                    fileList.push(filePath)
                }
            })
        
            return fileList
        }

        // Check if .als file needs processing (if .als has been modified after the last processing)
        function needsProcessing(alsFile, xmlFile) {
            if (!fs.existsSync(xmlFile)) {
                return true
            }
            
            const alsStats = fs.statSync(alsFile)
            const xmlStats = fs.statSync(xmlFile)
            
            return alsStats.mtime > xmlStats.mtime
        }

        // Process a single .als file
        function processAlsFile(als) {
            return new Promise((resolveFile, rejectFile) => {
                const alsDir = path.dirname(als)
                const xmlCacheDir = path.join(alsDir, '.xml_cache')
                
                // Create .xml_cache directory if it doesn't exist
                if (!fs.existsSync(xmlCacheDir)) {
                    fs.mkdirSync(xmlCacheDir, { recursive: true })
                }

                const outputFilePath = path.join(xmlCacheDir, path.basename(als, path.extname(als)) + '.xml')

                if (!needsProcessing(als, outputFilePath)) {
                    log(`Skipping ${als} - no changes detected`)
                    resolveFile()
                    return
                }

                const unzip = zlib.createUnzip()
                const input = fs.createReadStream(als)
                const output = fs.createWriteStream(outputFilePath)
            
                pipeline(input, unzip, output, (error) => {
                    if (error) {
                        log(`Unzip failed for file ${als}: ${error}`)
                        rejectFile(error)
                    } else {
                        log(`Unzip succeeded for file ${als}`)
                        resolveFile()
                    }
                })
            })
        }

        // Get all .als files in the directory and its subdirectories
        const alsFiles = getAlsFiles(inputDir)

        // Check if the directory is empty
        if (alsFiles.length === 0) {
            console.error(chalk.red('No .als file found in the directory'))
            reject(new Error('No .als files found'))
            return
        }

        // Process all .als files
        Promise.all(alsFiles.map(processAlsFile))
            .then(() => {
                console.log(chalk.green('All files processed successfully'))
                resolve()
            })
            .catch(error => {
                console.error(chalk.red('Error processing files:'), error)
                reject(error)
            })
    })
}