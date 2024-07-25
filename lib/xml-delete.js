import * as fs from 'fs'
import * as path from 'path'
import { log } from './logger.js'
import chalk from 'chalk'

export function xmlDelete() {
    return new Promise((resolve, reject) => {
        const directoryPath = process.argv[3]
        
        if (!directoryPath) {
            reject(new Error('No directory path provided'))
            return
        }

        if (!fs.existsSync(directoryPath)) {
            reject(new Error(`The path ${directoryPath} does not exist.`))
            return
        }

        // Find XML files in a directory
        function findXMLFiles(dir) {
            let xmlFiles = []
            const files = fs.readdirSync(dir)
        
            files.forEach(file => {
                const filePath = path.join(dir, file)
                const stats = fs.statSync(filePath)
        
                if (stats.isDirectory()) {
                    xmlFiles = xmlFiles.concat(findXMLFiles(filePath))
                } else if (stats.isFile() && path.extname(file) === '.xml') {
                    xmlFiles.push(filePath)
                }
            })
            return xmlFiles
        }

        // Delete all XML files in the given directory
        function deleteXMLFilesInDirectory(directoryPath) {
            const xmlFiles = findXMLFiles(directoryPath)
        
            if (xmlFiles.length === 0) {
                console.log(chalk.yellow(`No XML files found in directory: ${directoryPath}`))
                return
            }
        
            xmlFiles.forEach(xmlFilePath => {
                try {
                    fs.unlinkSync(xmlFilePath)
                    log(`Deleted file: ${xmlFilePath}`)
                } catch (err) {
                    console.error(chalk.red(`Failed to delete the file: ${xmlFilePath}`), err)
                }
            })
        }

        const stats = fs.statSync(directoryPath)
        if (!stats.isDirectory()) {
            console.error(chalk.red(`${directoryPath} is not a directory.`))
            process.exit(1)
        }

        try {
            deleteXMLFilesInDirectory(directoryPath)
            log(`XML deletion process completed for directory: ${directoryPath}`)
            resolve()
        } catch (error) {
            log(`An error occurred during XML deletion: ${error.message}`)
            reject(error)
        }
    })
}
