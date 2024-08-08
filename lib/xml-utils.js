import * as fs from 'fs'
import * as path from 'path'

// Find all the xml files in a given directory
export function getXMLFiles(directoryPath) {
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