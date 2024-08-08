import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import { log } from './logger.js'
import { elements } from './xml-elements.js'

export function needsXMLExtraction(xmlFilePath, alsFilePath) {
    if (!fs.existsSync(xmlFilePath)) {
        return true
    }

    const alsStats = fs.statSync(alsFilePath)
    const xmlStats = fs.statSync(xmlFilePath)

    return alsStats.mtime > xmlStats.mtime
}

function getAlsFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir)

    files.forEach(file => {
        const filePath = path.join(dir, file)
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== 'Backup') {
                getAlsFiles(filePath, fileList)
            }
        } else if (path.extname(file) === '.als') {
            fileList.push(filePath)
        }
    })

    return fileList
}

function findCorrespondingAlsFile(xmlFilePath, alsFiles) {
    const xmlFileName = path.basename(xmlFilePath, path.extname(xmlFilePath))
    return alsFiles.find(alsFile => {
        const alsFileName = path.basename(alsFile, path.extname(alsFile))
        return alsFileName === xmlFileName
    })
}

export function xmlExtract(updateProgress) {
    return new Promise((resolve, reject) => {
        const directoryPath = process.argv[3]

        function parseXMLFile(xmlFilePath, alsFilePath) {
            try {
                if (!needsXMLExtraction(xmlFilePath, alsFilePath)) {
                    log(`Skipping parsing of ${alsFilePath} - no changes detected`)
                    return null
                }

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

        const alsFiles = getAlsFiles(directoryPath)
        const xmlFiles = findXMLFiles(directoryPath)

        if (xmlFiles.length === 0) {
            console.log(chalk.yellow(`No XML files found in directory: ${directoryPath}`))
            resolve([])
            return
        }

        const results = []
        xmlFiles.forEach((xmlFile, index) => {
            const alsFile = findCorrespondingAlsFile(xmlFile, alsFiles)
            const result = parseXMLFile(xmlFile, alsFile)
            if (result !== null) {
                results.push(result)
            }
            const progress = Math.round(((index + 1) / xmlFiles.length) * 100)
            updateProgress(progress)
        })

        resolve(results)
    })
}

function findXMLFiles(directoryPath) {
    const files = []
    const walkDirectory = (dir) => {
        const contents = fs.readdirSync(dir)
        for (const item of contents) {
            const itemPath = path.join(dir, item)
            if (fs.statSync(itemPath).isDirectory()) {
                walkDirectory(itemPath)
            } else if (path.extname(item).toLowerCase() === '.xml') {
                files.push(itemPath)
            }
        }
    }
    walkDirectory(directoryPath)
    return files
}