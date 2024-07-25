import * as fs from 'fs'
import * as zlib from 'zlib'
import { pipeline } from 'node:stream'
import * as path from 'path'
import { log } from './logger.js'

export function uncompress() {
    return new Promise((resolve, reject) =>  {
        // Get all .als files in a directory and its subdirectories
        function getAlsFiles(dir, fileList = []) {
            const files = fs.readdirSync(dir)
        
            files.forEach(file => {
                const filePath = path.join(dir, file)
                if (fs.statSync(filePath).isDirectory()) {
                    getAlsFiles(filePath, fileList)
                } else if (path.extname(file) === '.als') {
                    fileList.push(filePath)
                }
            })
        
            return fileList
        }

        // Get the input directory
        const inputDir = process.argv[2]
        if (!inputDir) {
            console.error('Please provide a directory as the second argument.')
            process.exit(1)
        }

        // Get all .als files in the directory and its subdirectories
        const alsFiles = getAlsFiles(inputDir)

        // Check if the directory is empty
        if (alsFiles.length === 0) {
            console.error(chalk.red('No .als file found in the directory'))
            process.exit(1)
        }

        let completedFiles = 0
        const totalFiles = alsFiles.length

        // Process each .als file
        alsFiles.forEach(als => {
            const unzip = zlib.createUnzip()

            const outputFilePath = path.join(path.dirname(als), path.basename(als, path.extname(als)) + '.xml')
        
            const input = fs.createReadStream(als)
            const output = fs.createWriteStream(outputFilePath)
        
            pipeline(input, unzip, output, (error) => {
                if (error) {
                    log(`Unzip failed for file ${als}: ${error}`)
                } else {
                    log(`Unzip succeeded for file ${als}`)
                }
                completedFiles++
                if (completedFiles === totalFiles) {
                    resolve()
                }
            })
        })
    })
}
