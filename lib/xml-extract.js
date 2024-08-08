import * as fs from 'fs'
import chalk from 'chalk'
import { log } from './logger.js'
import { elements } from './xml-elements.js'
import { getXMLFiles } from './xml-utils.js'

export function xmlExtract(updateProgress) {
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

        const xmlFiles = getXMLFiles(directoryPath)

        if (xmlFiles.length === 0) {
            console.log(chalk.yellow(`No XML files found in directory: ${directoryPath}`))
            resolve([])
            return
        }

        const results = []
        xmlFiles.forEach((xmlFile, index) => {
            const result = parseXMLFile(xmlFile)
            if (result !== null) {
                results.push(result)
            }
            const progress = Math.round(((index + 1) / xmlFiles.length) * 100)
            updateProgress(progress)
        })

        resolve(results)
    })
}