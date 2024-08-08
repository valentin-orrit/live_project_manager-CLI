import * as fs from 'fs'
import chalk from 'chalk'
import { log } from './logger.js'
import { elements } from './xml-elements.js'
import { getXMLFiles } from './xml-utils.js'
import { getFromDB, saveToDB } from './database.js'

function needsParsing(xmlFile, fileData) {
    const xmlStats = fs.statSync(xmlFile)
    const lastParsed = fileData ? new Date(fileData.lastParsed) : null
    return !lastParsed || lastParsed < xmlStats.mtime
}

export async function xmlExtract(updateProgress) {
    const directoryPath = process.argv[3]

    function parseXMLFile(xmlFilePath) {
        try {
            const elementsToExtract = elements(xmlFilePath)
            log(`Parsed ${xmlFilePath}`)
            return { filePath: xmlFilePath, lastParsed: new Date().toISOString(), elements: elementsToExtract }
        } catch (err) {
            console.error(chalk.red(`Failed to parse the file: ${xmlFilePath}`), err)
            return null
        }
    }

    if (!fs.existsSync(directoryPath)) {
        throw new Error(`The path ${directoryPath} does not exist.`)
    }

    const stats = fs.statSync(directoryPath)
    if (!stats.isDirectory()) {
        throw new Error(`${directoryPath} is not a directory.`)
    }

    const xmlFiles = getXMLFiles(directoryPath)
    if (xmlFiles.length === 0) {
        console.log(chalk.yellow(`No XML files found in directory: ${directoryPath}`))
        return []
    }

    const dbData = await getFromDB()
    const results = []

    xmlFiles.forEach((xmlFile, index) => {
        const fileData = dbData.find(item => item.filePath === xmlFile)

        if (needsParsing(xmlFile, fileData)) {
            const result = parseXMLFile(xmlFile)
            if (result !== null) {
                results.push(result)
            }
        } else {
            log(`Skipping parsing of ${xmlFile} - no changes detected`)
        }

        const progress = Math.round(((index + 1) / xmlFiles.length) * 100)
        updateProgress(progress)
    })

    if (results.length > 0) {
        await saveToDB(results)
    }

    return results
}
