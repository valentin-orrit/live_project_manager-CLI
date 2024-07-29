import * as fs from 'fs'
import * as path from 'path'
import { XMLValidator } from 'fast-xml-parser'
import { log } from './logger.js'
import { findXMLFiles } from './xml-utils.js'
import chalk from 'chalk'

export function xmlValidate() {
    return new Promise((resolve, reject) => {
        const directoryPath = process.argv[3]
       
        // Validate XML data
        function validateXML(xmlData, xmlFilePath) {
            const result = XMLValidator.validate(xmlData)
       
            if (result === true) {
                log(`${xmlFilePath} is valid`)
            } else if (result.err) {
                log(`${xmlFilePath} is invalid : ${result.err.msg}`)
            }
        }
       
        // Validate all XML files in the given directory
        function validateXMLFilesInDirectory(directoryPath) {
            const xmlFiles = findXMLFiles(directoryPath)
       
            if (xmlFiles.length === 0) {
                console.log(chalk.yellow(`No XML files found in directory: ${directoryPath}`))
                return
            }
       
            xmlFiles.forEach(xmlFilePath => {
                try {
                    const xmlData = fs.readFileSync(xmlFilePath, 'utf-8')
                    validateXML(xmlData, xmlFilePath)
                } catch (err) {
                    console.error(chalk.red(`Failed to read the file: ${xmlFilePath}`), err)
                }
            })
        }
       
        // Check if the given path is a directory
        if (!fs.existsSync(directoryPath)) {
            console.error(chalk.red(`The path ${directoryPath} does not exist.`))
            reject(new Error(`The path ${directoryPath} does not exist.`))
            return
        }
       
        const stats = fs.statSync(directoryPath)
        if (!stats.isDirectory()) {
            console.error(chalk.red(`${directoryPath} is not a directory.`))
            reject(new Error(`${directoryPath} is not a directory.`))
            return
        }

        try {
            validateXMLFilesInDirectory(directoryPath)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}