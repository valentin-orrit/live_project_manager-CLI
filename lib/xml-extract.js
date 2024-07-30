import * as fs from 'fs'
import chalk from 'chalk'
import { findXMLFiles } from './xml-utils.js'
import { log } from './logger.js'
import { elements } from './elements.js'

export function xmlExtract() {
    return new Promise((resolve, reject) => {
        const directoryPath = process.argv[3]
        
        function parseXMLFile(xmlFilePath) {
            try {
                const elementsToExtract = elements(xmlFilePath)
                log(`Parsed ${xmlFilePath}`)
                return elementsToExtract
            } catch (err) {
                console.error(chalk.red(`Failed to parse the file: ${xmlFilePath}`), err)
                return null
            }
        }

        if (!fs.existsSync(directoryPath)) {
            reject(new Error(`The path ${directoryPath} does not exist.`))
            return
        }

        const stats = fs.statSync(directoryPath)
        if (!stats.isDirectory()) {
            reject(new Error(`${directoryPath} is not a directory.`))
            return
        }

        const xmlFiles = findXMLFiles(directoryPath)

        if (xmlFiles.length === 0) {
            console.log(chalk.yellow(`No XML files found in directory: ${directoryPath}`))
            resolve([])
            return
        }

        const results = xmlFiles.map(parseXMLFile).filter(result => result !== null)
        resolve(results)
    })
}