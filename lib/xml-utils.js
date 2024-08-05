import * as fs from 'fs'
import * as path from 'path'

export function findXMLFiles(dir) {
    let xmlFiles = []
    const files = fs.readdirSync(dir)

    files.forEach(file => {
        const filePath = path.join(dir, file)
        const stats = fs.statSync(filePath)

        if (stats.isDirectory()) {
            if (file !== 'Backup') {
                xmlFiles = xmlFiles.concat(findXMLFiles(filePath))
            }
        } else if (file.endsWith('.xml')) {
            xmlFiles.push(filePath)
        }
    })
    return xmlFiles
}