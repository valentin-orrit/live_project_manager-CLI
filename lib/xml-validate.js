import * as fs from 'fs'
import * as path from 'path'
import { XMLValidator } from 'fast-xml-parser'
import { log } from './logger.js'


export function validate() {
    return new Promise((resolve, reject) => {
        const directoryPath = process.argv[2]
        
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
        
        // Validate XML data
        function validate(xmlData, xmlFilePath) {
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
                    validate(xmlData, xmlFilePath)
                } catch (err) {
                    console.error(chalk.red(`Failed to read the file: ${xmlFilePath}`), err)
                }
            })
        }
        
        // Check if the given path is a directory
        if (!fs.existsSync(directoryPath)) {
            console.error(chalk.red(`The path ${directoryPath} does not exist.`))
            process.exit(1)
        }
        
        const stats = fs.statSync(directoryPath)
        if (!stats.isDirectory()) {
            console.error(chalk.red(`${directoryPath} is not a directory.`))
            process.exit(1)
        }
        
        validateXMLFilesInDirectory(directoryPath)

        try {
            validateXMLFilesInDirectory(directoryPath)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}
