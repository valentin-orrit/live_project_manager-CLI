import * as fs from 'fs'
import * as zlib from 'zlib'
import { pipeline } from 'node:stream'
import * as path from 'path'

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

// Process each .als file
alsFiles.forEach(als => {
    const unzip = zlib.createUnzip()
    
    // Determine the output file path with the .xml extension
    const outputFilePath = path.join(path.dirname(als), path.basename(als, path.extname(als)) + '.xml')

    const input = fs.createReadStream(als)
    const output = fs.createWriteStream(outputFilePath)

    pipeline(input, unzip, output, (error) => {
        if (error) {
            console.error('Pipeline failed for file', als, ':', error)
        } else {
            console.log('Pipeline succeeded for file', als, '. Output written to:', outputFilePath)
        }
    })
})
